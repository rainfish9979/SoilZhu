// Name: AudioAnalyser
// ID: Audio Analyser V5
// Description: 高级音频分析工具，支持变速播放、节拍检测、实时频谱分析和波形分析
// By: 空明2403 

class AudioAnalyserExtension {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.frequencyDataArray = null;
        this.waveformDataArray = null;
        this.source = null;
        this.playing = false;
        this.spectrum = [];
        this.loudness = 0;
        this.loudnessDB = -Infinity;
        this.audioBuffer = null;
        this.duration = 0;
        this.playbackRate = 1.0;
        this.totalPlayedTime = 0;
        this.isAnalysisComplete = false;
        this.beatParams = {
            decayRate: 0.96,
            beatHold: 40,
            beatDecayRate: 0.98,
            beatMin: 0.15,
            frequencyBands: [
                { low: 20, high: 100 },
                { low: 100, high: 1000 },
                { low: 1000, high: 5000 }
            ],
            beatThresholds: [1.4, 1.3, 1.2],
            beatRelease: 200
        };
        this.energyHistory = new Array(30).fill([0, 0, 0]);
        this.bandEnergies = [0, 0, 0];
        this.beatEnergy = [0, 0, 0];
        this.lastBeatTime = 0;
        this.scratchBlockRunning = false;
        this.activeBlock = null;
        this.originalStart = 0;
        this.originalEnd = 0;
    }

    getInfo() {
        return {
            id: 'audioanalyser',
            name: 'Audio Analyser V5',
            color1: '#00baff',
            blocks: [
                {
                    opcode: 'loadFromDataURL',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '加载音频 [DATA_URL]',
                    arguments: {
                        DATA_URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'startAnalysis',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '开始音频解析'
                },
                {
                    opcode: 'startAnalysisFromTo',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '从 [START] 秒到 [END] 秒解析',
                    arguments: {
                        START: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'startAnalysisWithSpeed',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '以 [SPEED] 倍速从 [START] 到 [END] 秒解析',
                    arguments: {
                        SPEED: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1.0
                        },
                        START: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'setPlaybackSpeed',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置播放速度为 [SPEED] 倍',
                    arguments: {
                        SPEED: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1.0
                        }
                    }
                },
                {
                    opcode: 'stopAnalysis',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '停止解析'
                },
                {
                    opcode: 'getFrequency',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[BIN] 频段的频率值',
                    arguments: {
                        BIN: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'isPlaying',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '正在播放?'
                },
                {
                    opcode: 'getWaveform',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[INDEX] 位置的波形值',
                    arguments: {
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getWaveformLength',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '波形数据长度'
                },
                {
                    opcode: 'beatDetected',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '检测到节拍?'
                },
                {
                    opcode: 'getLoudness',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '当前响度'
                },
                {
                    opcode: 'getLoudnessDB',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '当前响度(dB)'
                },
                {
                    opcode: 'getBandEnergy',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[BAND] 频段能量',
                    arguments: {
                        BAND: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'startAnalysisFromToUntilComplete',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '以 [SPEED] 倍速解析从 [START] 到 [END] 秒直到解析完成',
                    arguments: {
                        SPEED: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1.0
                        },
                        START: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'getPlaybackSpeed',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '当前播放速度'
                }
            ]
        };
    }

    async loadFromDataURL(args) {
        try {
            if (this.audioContext) {
                await this.audioContext.close();
            }
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(args.DATA_URL);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.duration = this.audioBuffer.duration;
            return true;
        } catch (error) {
            console.error('音频加载失败:', error);
            return false;
        }
    }

    _startAnalysis(startTime, endTime, onComplete) {
        if (!this.audioBuffer || !this.audioContext) {
            console.error('音频未加载');
            this.scratchBlockRunning = false;
            onComplete?.();
            return;
        }

        this.cleanupResources();

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.frequencyDataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.waveformDataArray = new Uint8Array(this.analyser.fftSize);

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        const validSpeed = Math.min(Math.max(this.playbackRate, 0.25), 4.0);
        this.source.playbackRate.value = validSpeed;
        const remainingDuration = Math.min(endTime, this.duration) - startTime;
        const playbackDuration = remainingDuration / validSpeed;

        this.source.onended = () => {
            this.playing = false;
            this.totalPlayedTime += remainingDuration;

            if (this.totalPlayedTime < (endTime - startTime)) {
                const nextStart = startTime + this.totalPlayedTime;
                this._continueAnalysis(nextStart, endTime, onComplete);
            } else {
                this._completeAnalysis(onComplete);
            }
        };

        try {
            this.source.start(0, startTime, playbackDuration);
            this.playing = true;
            this._startUpdateLoop();
        } catch (e) {
            console.error('播放错误:', e);
            this._completeAnalysis(onComplete);
        }
    }

    _continueAnalysis(startTime, endTime, onComplete) {
        this.cleanupResources();

        const newSource = this.audioContext.createBufferSource();
        newSource.buffer = this.audioBuffer;
        newSource.playbackRate.value = this.playbackRate;
        newSource.connect(this.analyser);
        this.source = newSource;

        const remainingDuration = endTime - startTime;
        const playbackDuration = remainingDuration / this.playbackRate;

        newSource.onended = () => {
            this.playing = false;
            this.totalPlayedTime += remainingDuration;

            if (this.totalPlayedTime < (this.originalEnd - this.originalStart)) {
                const nextStart = this.originalStart + this.totalPlayedTime;
                this._continueAnalysis(nextStart, endTime, onComplete);
            } else {
                this._completeAnalysis(onComplete);
            }
        };

        try {
            newSource.start(0, startTime, playbackDuration);
            this.playing = true;
        } catch (e) {
            console.error('继续播放错误:', e);
            this._completeAnalysis(onComplete);
        }
    }

    _completeAnalysis(onComplete) {
        this.isAnalysisComplete = true;
        this.scratchBlockRunning = false;
        this.cleanupResources();
        this._resetAnalyserData();
        onComplete?.();
    }

    cleanupResources() {
        if (this.source) {
            try {
                this.source.stop();
                this.source.disconnect();
            } catch (e) {
                console.warn('资源释放错误:', e);
            }
            this.source = null;
        }
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
    }

    _resetAnalyserData() {
        this.spectrum = [];
        this.loudness = 0;
        this.loudnessDB = -Infinity;
        this.beatEnergy = [0, 0, 0];
        this.bandEnergies = [0, 0, 0];
        this.energyHistory = new Array(30).fill([0, 0, 0]);
        this.lastBeatTime = 0;

        if (this.frequencyDataArray) this.frequencyDataArray.fill(0);
        if (this.waveformDataArray) this.waveformDataArray.fill(128);
    }

    _startUpdateLoop() {
        const update = () => {
            if (this.playing && this.analyser) {
                this.analyser.getByteFrequencyData(this.frequencyDataArray);
                this.analyser.getByteTimeDomainData(this.waveformDataArray);
                this.spectrum = Array.from(this.frequencyDataArray);
                this.calculateEnergy();
                this.updateBeatDetection();
                this.calculateLoudness();
                requestAnimationFrame(update);
            } else {
                this._resetAnalyserData();
            }
        };
        update();
    }

    startAnalysis() {
        this._startAnalysis(0, this.duration);
    }

    startAnalysisFromTo(args) {
        const start = Math.max(0, Number(args.START) || 0);
        const end = Math.min(this.duration, Number(args.END) || this.duration);
        this._startAnalysis(start, end);
    }

    startAnalysisWithSpeed(args) {
        const speed = Math.min(Math.max(Number(args.SPEED) || 1.0, 0.25), 4.0);
        this.playbackRate = speed;
        const start = Math.max(0, Number(args.START) || 0);
        const end = Math.min(this.duration, Number(args.END) || this.duration);
        this._startAnalysis(start, end);
    }

    setPlaybackSpeed(args) {
        const speed = Math.min(Math.max(Number(args.SPEED) || 1.0, 0.25), 4.0);
        this.playbackRate = speed;
        if (this.source) {
            this.source.playbackRate.value = speed;
        }
    }

    stopAnalysis() {
        this.cleanupResources();
        this.playing = false;
        this.totalPlayedTime = 0;
        this.isAnalysisComplete = true;
        this.scratchBlockRunning = false;
        this._resetAnalyserData();
    }

    startAnalysisFromToUntilComplete(args) {
        const speed = Math.min(Math.max(Number(args.SPEED) || 1.0, 0.25), 4.0);
        this.playbackRate = speed;
        const start = Math.max(0, Number(args.START) || 0);
        const end = Math.min(this.duration, Number(args.END) || this.duration);

        this.originalStart = start;
        this.originalEnd = end;
        this.totalPlayedTime = 0;
        this.isAnalysisComplete = false;
        this.scratchBlockRunning = true;

        return new Promise((resolve) => {
            const context = {};
            this.activeBlock = context;

            this._startAnalysis(start, end, () => {
                if (this.activeBlock === context) {
                    this.scratchBlockRunning = false;
                    resolve();
                }
            });

            const check = () => {
                if (this.scratchBlockRunning && this.activeBlock === context) {
                    requestAnimationFrame(check);
                } else {
                    resolve();
                }
            };
            check();
        });
    }

    calculateEnergy() {
        const sampleRate = this.audioContext?.sampleRate || 44100;
        const binSize = sampleRate / this.analyser.fftSize;
        
        this.bandEnergies = this.beatParams.frequencyBands.map((band, index) => {
            const startBin = Math.floor(band.low / binSize);
            const endBin = Math.min(
                Math.floor(band.high / binSize),
                this.frequencyDataArray.length - 1
            );
            let sum = 0;
            for (let i = startBin; i <= endBin; i++) {
                sum += this.frequencyDataArray[i];
            }
            return sum / Math.max(1, endBin - startBin + 1);
        });
    }

    updateBeatDetection() {
        const now = Date.now();
        this.bandEnergies.forEach((energy, index) => {
            const avg = this.energyHistory.reduce((sum, arr) => sum + arr[index], 0) / this.energyHistory.length;
            const threshold = Math.max(
                avg * this.beatParams.beatThresholds[index],
                this.beatParams.beatMin
            );
            
            if (energy > threshold && (now - this.lastBeatTime) > this.beatParams.beatRelease) {
                this.lastBeatTime = now;
                this.beatEnergy[index] = 1.0;
            }
            
            this.beatEnergy[index] = Math.max(
                this.beatEnergy[index] * this.beatParams.beatDecayRate,
                0
            );
        });
        
        this.energyHistory.push([...this.bandEnergies]);
        if (this.energyHistory.length > 30) {
            this.energyHistory.shift();
        }
    }

    calculateLoudness() {
        if (!this.waveformDataArray) {
            this.loudness = 0;
            this.loudnessDB = -Infinity;
            return;
        }
        
        const floatSamples = Array.from(this.waveformDataArray)
            .map(s => (s - 128) / 128);
        
        const sum = floatSamples.reduce((acc, val) => acc + val * val, 0);
        const rms = Math.sqrt(sum / floatSamples.length);
        
        this.loudness = Math.min(Math.max(rms * 100, 0), 100);
        this.loudnessDB = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
    }

    getFrequency(args) {
        const bin = Math.min(
            Math.max(0, args.BIN | 0),
            this.spectrum.length - 1
        );
        return this.playing ? this.spectrum[bin] || 0 : 0;
    }

    isPlaying() {
        return this.playing;
    }

    getWaveform(args) {
        if (!this.waveformDataArray) return 0;
        const index = Math.min(
            Math.max(0, args.INDEX | 0),
            this.waveformDataArray.length - 1
        );
        return this.playing ? (this.waveformDataArray[index] - 128) / 128 : 0;
    }

    getWaveformLength() {
        return this.waveformDataArray?.length || 0;
    }

    beatDetected() {
        return this.playing && this.beatEnergy.some(e => e > 0.5);
    }

    getLoudness() {
        return this.playing ? this.loudness.toFixed(2) : '0.00';
    }

    getLoudnessDB() {
        return this.playing ? 
            (this.loudnessDB === -Infinity ? '-Infinity' : this.loudnessDB.toFixed(2)) 
            : '-Infinity';
    }

    getBandEnergy(args) {
        const band = Math.min(
            Math.max(0, args.BAND | 0),
            this.bandEnergies.length - 1
        );
        return this.playing ? this.bandEnergies[band]?.toFixed(2) || 0 : 0;
    }

    getPlaybackSpeed() {
        return this.playbackRate.toFixed(2);
    }
}

Scratch.extensions.register(new AudioAnalyserExtension());