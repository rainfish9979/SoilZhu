#include <iostream>
using namespace std;

int main() {
    int numbers[4];
    int jishu = 0;
    int oushu = 0;

    cout << "Input 4 Numbers!" << endl;

    for (int i = 0; i < 4; ++i) {
        cin >> numbers[i];
        if (numbers[i] % 2 == 0) {
            oushu += 1;
        } else {
            jishu += 1;
        }
    }

    cout << "odd number: " << jishu << " even number: " << oushu << endl;

    return 0;
}
