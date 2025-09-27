import 'dart:io';
void main(){
    print("Enter your name:");
    String? name = stdin.readLineSync(); 

    print("Hello, $name!");
    //we can also print in using std.out
    stdout.write("This is an another way to print $name.");
}