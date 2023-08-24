#include <iostream>
using namespace std;

int main() {
    int nstudents, nsubjects;
    cin >> nstudents >> nsubjects;
    int studentlist[nstudents];
    int result[nstudents][nsubjects][9];
    char grade[nstudents][nsubjects][1];
    for (int i = 0; i < nstudents; i++) {
        cout << "Registration no: ";
        cin >> studentlist[i];
        cout << "Enter the marks in order:\nQuiz 1(5), Session 1(15), Quiz 2(5), Session 2(15), Assignment(5), Attendance(5), External(50):\n";
        for (int j = 0; j < nsubjects; j++) {
            cout << "Subject " << j << endl;
            for (int k = 0; k < 7; k++) {
                cin >> result[i][j][k];
            }
            result[i][j][7] = result[i][j][0] + result[i][j][1] + result[i][j][2] + result[i][j][3] + result[i][j][4] + result[i][j][5];
            result[i][j][8] = result[i][j][6] + result[i][j][7];
            grade[i][j][0] = (result[i][j][8] >= 85) ? 'S' : (result[i][j][8] >= 75) ? 'A' : (result[i][j][8] >= 65) ? 'B' : (result[i][j][8] >= 55) ? 'C' : (result[i][j][8] >= 45) ? 'D' : (result[i][j][8] >= 35) ? 'E' : 'F';
        }
    }
    cout << "Quiz 1(5), Session 1(15), Quiz 2(5), Session 2(15), Assignment(5), Attendance(5), Internal(50), External(50), Total(100), Grade\n";
    for (int i = 0; i < nstudents; i++) {
        cout << "Registration no: " << studentlist[i];
        for (int j = 0; j < nsubjects; j++) {
            cout << "Subject " << j << endl;
            for (int k = 0; k < 9; k++) {
                cout << result[i][j][k] << " ";
            }
            cout << grade[i][j][0] << endl;
        }
    }
    return 0;
}
