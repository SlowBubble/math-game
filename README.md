
# m1a

Build a math game using index.html and main.js using a canvas
Set up:
- Have a people data structure:
```
[
    {
        "name": "Bluey",
        "age": 5
    },
    {
        "name": "Bingo",
        "age": 3
    }
]
```
Loop:
- Display "Press Space"
- When the user press space, use the younger person (Bingo in this case) and pick a number N > the min age of the people (3 in this case) and < 8, and ask "When ${Bingo} is ${N}, how old will ${Bluey} be?"
  - Display "$N + $age_difference"
    - In this case, age_difference will be 5 - 3.
- When the user press on a digit, display the digit.
  - If the digit does not match the correct answer, then say "Incorrect. Please try again."
  - If the digit is correct, then say "Very nice. When ${Bingo} is ${N},  ${Bluey} will be $correct_answer."
- Repeat the loop by displaying "Press Space". 
