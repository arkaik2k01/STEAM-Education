import { db } from '../firebase/config.js';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';

// Educational content structure
const educationalContent = {
  modules: [
    {
      title: "Basic Python (Drag and Drop)",
      description: "Welcome to Florida Space Institute's educational tool! The first module will be a very basic introduction to Python concepts that will be used in robotics, which will be explored in later modules.",
      order: 1,
      preAssessment: {
        questions: [
          {
            question: "Which of these is NOT a programming language?",
            options: ["Java", "Haskell", "C#", "Violet"],
            correctAnswer: "Violet"
          },
          {
            question: "Can you reassign variable types in Python? For example, a string type to an integer type.\nx = 'John'\nx = 3",
            options: ["Yes", "No"],
            correctAnswer: "Yes"
          },
          {
            question: "Which is the correct method used to print output in Python?",
            options: ["printf(name)", "print(name)", "std::out << name << std::endl", "console.log(name)"],
            correctAnswer: "print(name)"
          },
          {
            question: "What is the value of apple in the dictionary below?\nfruits = {'apple':10, 'banana':23, 'orange':4, 'grape':16}",
            options: ["10", "23", "4", "16"],
            correctAnswer: "10"
          },
          {
            question: "What does the set, myset, look like after the following commands are executed?\nmyset.add(1)\nmyset.add(1)\nmyset.add(4)\nmyset.add(5)\nmyset.add(1)",
            options: ["{1,1,4,5}", "{1,1,4,5,1}", "{1,4,5}", "{1,4,5,1}"],
            correctAnswer: "{1,4,5}"
          },
          {
            question: "What is the output of this for-loop?\nfor i in range(3):\ni = i + 2\nprint(i)",
            options: ["0,1,2", "3,4,5", "1,2,3", "2,3,4"],
            correctAnswer: "2,3,4"
          }
        ]
      },
      sections: [
        {
          title: "Data Types",
          content: "Data types express the type of variable. For example, integers are whole numbers and floats are numbers with decimals.\n\nIn some programming languages, data types are explicitly defined. This means the program needs to know the type of variable before compiling the code. This is done using data type keywords:\n\nint x = 4\nstring name = \"David\"\n\nHowever, Python supports implicit type declaration. There is no need to use specific keywords to define a variable. When Python reads a variable, it will interpret its type automatically based on the variable's value.\n\nx = 10\nname = \"Lucy\"\n\nHere is a list of possible data types in Python:\n\nInt – whole number\nFloat – number with decimals\nStr – strings, any word. (defined with \"\" or '')\nList – ordered sequence of objects (ex. ['Smith', 3, 5.8])\nTuple – ordered sequence of objects. Cannot be modified after created. (ex. (2,3))\nDictionary – unordered key:value pairs. (ex. {'apple':1})\nSet – unordered collection of unique objects. Cannot have the same value twice. (ex. {2,3})\nBool – True or False. Must be capitalized.",
          order: 1,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Variable Value Matching",
              description: "Match each variable with its appropriate value. Consider how Python would store these values.",
              items: [
                { id: "var1", text: "personName = _______", category: "'John Smith'" },
                { id: "var2", text: "integerNum = _______", category: "12" },
                { id: "var3", text: "decimalNum = _______", category: "3.5" },
                { id: "var4", text: "dogName = _______", category: "'Spot'" },
                { id: "var5", text: "numList = _______", category: "[1,2]" },
                { id: "var6", text: "setList = _______", category: "{1,2}" },
                { id: "var7", text: "trueBool = ______", category: "True" },
                { id: "var8", text: "falseBool = ______", category: "False" },
                { id: "var9", text: "myDictionary = ________", category: "{1: 'one', 2: 'two'}" },
                { id: "var10", text: "myTuple = ________", category: "(1,2)" }
              ],
              correctAnswers: {
                "'John Smith'": ["var1"],
                "12": ["var2"],
                "3.5": ["var3"],
                "'Spot'": ["var4"],
                "[1,2]": ["var5"],
                "{1,2}": ["var6"],
                "True": ["var7"],
                "False": ["var8"],
                "{1: 'one', 2: 'two'}": ["var9"],
                "(1,2)": ["var10"]
              }
            }
          ]
        },
        {
          title: "Declaring a Variable",
          content: "When declaring a variable in Python, you can choose the name. However, it is important to note that names cannot start with numbers or have any spaces. For example…\n\nfirst name = \"Jeff\"\n1st = \"Jeff\"\n\n… will not work for Python.\n\nChoosing a name for a variable should be specific and related to what the variable is or what it is doing. It also should NOT be a keyword that exists in Python. For example, True is a Boolean keyword and cannot be used as a variable name.\n\nIt does not matter if you use \"_\" or capitalization to separate multiple words in a single variable. Make sure you are consistent with whichever one you choose.",
          order: 2,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Variable Naming",
              description: "Match the correct variable names with their values",
              items: [
                { id: "blank1", text: "______ = 3.14", answer: "pi" },
                { id: "blank2", text: "______ = 'strawberry'", answer: "fruit" },
                { id: "blank3", text: "______ = 9 + 2", answer: "add_num" },
                { id: "blank4", text: "______ = [\"a\", \"b\", \"c\"]", answer: "letterList" },
                { id: "blank5", text: "______ = (x,y)", answer: "coordinate" },
                { id: "blank6", text: "______ = {'socks':3, 'shirt':5, 'pants':6}", answer: "stockQuantity" },
                { id: "blank7", text: "______ = True", answer: "isEmpty" }
              ],
              possibleAnswers: [
                "pi",
                "fruit",
                "add_num",
                "letterList",
                "coordinate",
                "stockQuantity",
                "isEmpty"
              ],
              correctAnswers: {
                "pi": ["blank1"],
                "fruit": ["blank2"],
                "add_num": ["blank3"],
                "letterList": ["blank4"],
                "coordinate": ["blank5"],
                "stockQuantity": ["blank6"],
                "isEmpty": ["blank7"]
              }
            }
          ]
        },
        {
          title: "Comparison Operators",
          content: "Comparison operators are used to compare two values that will return True or False based on the condition's evaluation. These include:\n\nEqual to → ==\nNot equal to → !=\nGreater than → >\nLess than → <\nGreater than or equal to → >=\nLess than or equal to → <=",
          order: 3,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Comparison Results",
              description: "Fill in the correct comparison operator results",
              items: [
                { id: "comp1", text: "print(1 > 0) ______", category: "True" },
                { id: "comp2", text: "print(2 != 2) ______", category: "False" },
                { id: "comp3", text: "print(hi == hi) _______", category: "True" },
                { id: "comp4", text: "print(4 >= 1) ______", category: "True" },
                { id: "comp5", text: "print(16 <= 16) ______", category: "True" },
                { id: "comp6", text: "print(2 < 1) ______", category: "False" }
              ],
              correctAnswers: {
                "True": ["comp1", "comp3", "comp4", "comp5"],
                "False": ["comp2", "comp6"]
              }
            }
          ]
        },
        {
          title: "If Statements",
          content: "If statements are used for conditional execution in Python. They allow your program to make decisions based on certain conditions.",
          order: 5,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - If Statements",
              description: "Fill in the blanks to complete the if statements",
              questions: [
                {
                  id: "q1",
                  text: "Check if a student passed or failed:\n\nscore = 75\n___ score >= ____:\n    print(\"Passed!\")\n____:\n    print(\"Failed!\")",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "if" },
                    { id: "b2", position: 2, correctAnswer: "70" },
                    { id: "b3", position: 3, correctAnswer: "else" }
                  ]
                },
                {
                  id: "q2",
                  text: "Determine grade level:\n\ngrade = 85\n___ grade >= 90:\n    print(\"A\")\n____ grade >= 80:\n    print(\"B\")\n____ grade >= 70:\n    print(\"C\")\n____:\n    print(\"F\")",
                  blanks: [
                    { id: "b4", position: 1, correctAnswer: "if" },
                    { id: "b5", position: 2, correctAnswer: "elif" },
                    { id: "b6", position: 3, correctAnswer: "elif" },
                    { id: "b7", position: 4, correctAnswer: "else" }
                  ]
                },
                {
                  id: "q3",
                  text: "Check multiple conditions:\n\nage = 18\nhas_license = True\n\n___ age ___ 18 ___ has_license ___ True:\n    print(\"Can drive\")\n____:\n    print(\"Cannot drive\")",
                  blanks: [
                    { id: "b8", position: 1, correctAnswer: "if" },
                    { id: "b9", position: 2, correctAnswer: ">=" },
                    { id: "b10", position: 3, correctAnswer: "and" },
                    { id: "b11", position: 4, correctAnswer: "==" },
                    { id: "b12", position: 5, correctAnswer: "else" }
                  ]
                }
              ],
              possibleAnswers: [
                "if", "elif", "else", "70", ">=", "==", "and", "True"
              ]
            }
          ]
        },
        {
          title: "Loops",
          content: "Loops are used to repeat a block of code multiple times. Python has two main types of loops: for loops and while loops.",
          order: 6,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - Loops",
              description: "Fill in the blanks to complete the loops",
              questions: [
                {
                  id: "q1",
                  text: "Create a simple for loop:\n\nfruits = ['apple', 'banana', 'orange']\n___ fruit ___ _____:\n    print(_____)",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "for" },
                    { id: "b2", position: 2, correctAnswer: "in" },
                    { id: "b3", position: 3, correctAnswer: "fruits" },
                    { id: "b4", position: 4, correctAnswer: "fruit" }
                  ]
                },
                {
                  id: "q2",
                  text: "Create a while loop with a counter:\n\ncount = 0\n_____ count < 5:\n    print(count)\n    count = count ___ 1",
                  blanks: [
                    { id: "b5", position: 1, correctAnswer: "while" },
                    { id: "b6", position: 2, correctAnswer: "+" }
                  ]
                },
                {
                  id: "q3",
                  text: "Nested loop with range:\n\n___ i ___ _____(3):\n    ___ j ___ range(___):\n        print(f\"Position: {i},{j}\")",
                  blanks: [
                    { id: "b7", position: 1, correctAnswer: "for" },
                    { id: "b8", position: 2, correctAnswer: "in" },
                    { id: "b9", position: 3, correctAnswer: "range" },
                    { id: "b10", position: 4, correctAnswer: "for" },
                    { id: "b11", position: 5, correctAnswer: "in" },
                    { id: "b12", position: 6, correctAnswer: "3" }
                  ]
                },
                {
                  id: "q4",
                  text: "Loop with break statement:\n\n___ i ___ _____(10):\n    ___ i == 5:\n        _____\n    print(i)",
                  blanks: [
                    { id: "b13", position: 1, correctAnswer: "for" },
                    { id: "b14", position: 2, correctAnswer: "in" },
                    { id: "b15", position: 3, correctAnswer: "range" },
                    { id: "b16", position: 4, correctAnswer: "if" },
                    { id: "b17", position: 5, correctAnswer: "break" }
                  ]
                }
              ],
              possibleAnswers: [
                "for", "in", "while", "range", "break", "continue",
                "fruits", "fruit", "+", "3", "if"
              ]
            }
          ]
        },
        {
          title: "Data Structures",
          content: "In programming, data structures are used to store and organize data. It will allow programmers to access data in an easy, manageable way. You have already been introduced to some data structures like tuples, sets, dictionaries, and lists. Here you will find specific functions that are used within each one.\n\nAs mentioned before, tuples are an ordered sequence of objects that cannot be modified after creation. These are helpful when wanting to return multiple data values from a function. Here are some helpful functions using the tuple below:\n\ntup = (1,2,3,3)\n\nAccessing an element:\ntup[0] → 1\n\nLength of a tuple:\nlen(tup) → 4\n\nNumber of occurrences of an element: tup.count(element)\ntup.count(3) → 2\n\nFind index of an element: tup.index(element)\ntup.index(2) → 1\n\nNote: Index will return the first instance of an element\n\nTuple unpacking: Assigns a tuple to multiple variables in a single line of code\n\none, two, three, three2 = tup\nprint(two) → 2\nprint(three2) → 3\n\nSets are used when a collection of objects must have unique values. Using the sets below, here are some useful functions:\n\nmySet = {1,2,3}\nmySet2 = {3,4,5}\n\nAdd an element: mySet.add(element)\nmySet.add(4) → {1,2,3,4}\n\nDelete an element: mySet.remove(element)\nmySet.remove(2) → {1,3}\n\nLength of set: len(set_name)\nlen(mySet) → 3\n\nUnion: Add two sets together\nunionSet = mySet.union(mySet2) → {1,2,3,4,5}\n\nIntersection: Returns any common values in both sets\nintersectSet = mySet.intersection(mySet2) → {3}\n\nDifference: Returns any values that are in the first set and NOT the second\ndiffSet = mySet.difference(mySet2) → {1,2}\n\nDictionaries allow programmers to have an easy way to search for items using key-value pairs. Below are some helpful functions:\n\nmyDict = {'name':'Henry Wade','age':17}\n\nGet the value of a key:\nmyDict.get('name') → Henry Wade\n\nGet all keys:\nmyDict.keys() → dict_keys(['name','age'])\n\nGet all values:\nmyDict.values() → dict_values(['Henry Wade',17])\n\nGet all key-value pairs:\nmyDict.items() → dict_items([('name':'Henry Wade'),('age':17)])\n\nUpdate: If a key exists, it will update. If not, it will be added to the dictionary\nmyDict.update({age:16}) → {'name':'Henry Wade', 'age':16}\n\nDelete: Removes a key and value pair\ndel myDict['age'] → {'name':'Henry Wade'}\n\nLength of dictionary:\nlen(myDict) → 2\n\nLists are the most commonly used data structure in Python. This is because lists are not as restricted as other data structures. They can store different types of values, grow dynamically (an unfixed size), and they have several useful functions that make it easy for programmers to use. Here are some of the most common functions:\n\nmyList = [1,\"Tim\",3.5]\nonlyNumList = [4,7,2,5]\n\nAdd to the end of a list:\nmyList.append(9) → [1,\"Tim\",3.5,9]\n\nAdd to a list at a specific position: myList.insert(index, value)\nmyList.insert(1, \"hello\") → [1,\"hello\",\"Tim\",3.5]\n\nDelete an item: The first instance of an item will be removed\nmyList.remove(3.5) → [1,\"Tim\"]\n\nGet length of a list:\nlen(myList) → 3\n\nUpdate an item in a list:\nmyList[0] = 4 → [4,\"Tim\",3.5]\n\nCount the number of occurrences of an item:\nmyList.count(3.5) → 1\n\nSort a list: ONLY with the same type of variables\nonlyNumList.sort() → [2,4,5,7]\n\nReverse a list: ONLY with the same type of variables\nonlyNumList.reverse() → [5,2,7,4]",
          order: 5,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - Data Structures",
              description: "Fill in the blanks for each data structure operation",
              questions: [
                {
                  id: "q1",
                  text: "Tuple Unpacking: Traverse the coordinate list to decrease the x value by 1 and increase the y value by 1.\n\ncoordinateList = [(2,8),(7,3),(2,1)]\nfor ___ in __________:\n    x = _____\n    y = _____\n    print(x-1,y+1)",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "coord" },
                    { id: "b2", position: 2, correctAnswer: "coordinateList" },
                    { id: "b3", position: 3, correctAnswer: "coord[0]" },
                    { id: "b4", position: 4, correctAnswer: "coord[1]" }
                  ]
                },
                {
                  id: "q2",
                  text: "Set Operations:\n\nset1 = {1,8,4,5,7,3}\nset2 = {2,3,9,4,5,6,1}\n\nprint(set1._____(set2))  # Combine sets\nprint(set1._____(set2))  # Find common elements\nprint(set1._____(set2))  # Elements in set1 but not in set2",
                  blanks: [
                    { id: "b5", position: 1, correctAnswer: "union" },
                    { id: "b6", position: 2, correctAnswer: "intersection" },
                    { id: "b7", position: 3, correctAnswer: "difference" }
                  ]
                },
                {
                  id: "q3",
                  text: "Dictionary Operations:\n\naddress = {'streetNum':1234,'streetName':'Berry Ln.','city':'Fruit City','state':'Texas','zip':67543,'age':7}\n\naddress.____({'streetNum':5678, 'streetName':'Longhorn Dr.'})  # Update values\ndel address[____]  # Remove age key\nprint(address)",
                  blanks: [
                    { id: "b8", position: 1, correctAnswer: "update" },
                    { id: "b9", position: 2, correctAnswer: "'age'" }
                  ]
                }
              ],
              possibleAnswers: [
                "coord", "coordinateList", "coord[0]", "coord[1]",
                "union", "intersection", "difference",
                "update", "'age'"
              ]
            }
          ]
        },
        {
          title: "Getting User Input",
          content: "When programming in any language, it may be required to ask the user for specific information. For example, if a website wants to save profile information like name, age, birthday, etc., it will need to gather that information from the user.\n\nTo get user input, use the keyword \"input\". You will also need a variable to save the information to.\n\nname = input(\"What is your name? \")\n\nOnce the user enters in a name, it is saved inside the \"name\" variable and can be used in the program.\n\nNote: When wanting to output variables to the screen, you can use the f-string method:\n\nprint(f\"My name is {name}!\")\n\n\"name\" is inside curly brackets indicating it is a variable. This method allows you to print out the information stored in variables easily.\n\nWhen a user enters in a value, it will always be of type string, its default type. However, you can convert the string to different types using specific keywords, as mentioned in the data types section. The most common ones are listed below:\n\nInteger → int(input(\"Enter your age: \"))\nFloat → float(input(\"Enter the cost: \"))\n\nIt is also possible to convert user data to a list. You can do this by using the split method:\n\nuserInput = input(\"Enter your shopping list, separated by a comma: \")\nshoppingList = userInput.split(\",\")",
          order: 6,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for user input",
              items: [
                "sports = {\"swimming\":7,\"football\":15,\"volleyball\":10,\"soccer\":9,\"basketball\":12,\"baseball\":14,\"wrestling\":15}\n\nname = _____(\"Enter your name: \")\nage = ___(input(\"Enter your age: \"))\ndata = input(\"Enter the sports you are trying out for, separated by a comma: \")\nuserSports = data.______(\",\")\n\n___ sport in ________:\n    if(age ___ sports[_____]):\n        print(_\"{sport}: Can try out!\")\n    else:\n        print(_\"{sport}: Cannot try out!\")"
              ]
            }
          ]
        },
        {
          title: "Functions",
          content: "Functions are used in programming to help separate large blocks of code to make it easier to read and manage. They are also useful when eliminating repetitive code. The common rule is that a function should complete one job. For example, if a programmer is writing a script that calculates the area of a square or volume of a cube given the appropriate measurements, one function should calculate the area while another one calculates the volume.\n\nFunctions have a name given by the programmer. It should be specific and related to what it does. Also, functions can have parameters, but do not always need one. Parameters are values passed into a function that will be used to complete its tasks. Using the example above, the area function will need the measurement of one side since area of square=side2.\n\nThe function would look like this:\n\ndef area_square(side):\n    area = side * side\n    return area\n\ndef = keyword used to define a function\narea_square = the unique name of the function\nside = parameter\nreturn = keyword used to return new information to store in a variable\narea = variable being returned\n\nEvery statement inside a function needs to be indented. This will tell the Python interpreter that they are a part of the function.\n\nIn order to run a function, it needs to be called. If the function is returning data, you need a variable to store the incoming information inside. From the example above, the function call looks like this:\n\narea = area_square(4)\n\nIt is important to note that the variable \"area\" has the same name as the variable inside the function. This is allowed because the variable inside the function is defined in a different scope, meaning it will only be used inside that function. The result from area_square will be stored in the \"area\" variable apart of the function call.\n\nHere is a function and the function call with no parameters:\n\ndef greeting():\n    print(\"Welcome!\")\n\ngreeting()",
          order: 7,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - Functions",
              description: "Fill in the blanks to complete the functions",
              questions: [
                {
                  id: "q1",
                  text: "Create a function to get and display a user's name:\n\n___ get_user_name():\n    name = ______(\"Name: \")\n    print(f\"Hello, {____}!\")\n\nget_user_name()",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "def" },
                    { id: "b2", position: 2, correctAnswer: "input" },
                    { id: "b3", position: 3, correctAnswer: "name" }
                  ]
                },
                {
                  id: "q2",
                  text: "Create a temperature conversion function:\n\n___ temperature_conversion(____):\n    celsius = (temp - 32) / 1.8\n    ______ celsius\n\nfahrenheit = 70\ncelsius = temperature_conversion(________)",
                  blanks: [
                    { id: "b4", position: 1, correctAnswer: "def" },
                    { id: "b5", position: 2, correctAnswer: "temp" },
                    { id: "b6", position: 3, correctAnswer: "return" },
                    { id: "b7", position: 4, correctAnswer: "fahrenheit" }
                  ]
                }
              ],
              possibleAnswers: [
                "def", "input", "name", "temp", "return", "fahrenheit"
              ]
            }
          ]
        },
        {
          title: "Classes",
          content: "Before you can understand classes completely, you need to be introduced to object-oriented programming.\n\nObject oriented programming is a technique used in software design to organize data into objects. Objects can hold their own attributes and methods that define their specific behaviors and properties.\n\nClasses are the templates that specify certain attributes and functions, called methods, that will define an object. These objects represent an instance of a class because they are created from them. Each object can have unique attribute values. For example, here is a basic class structure along with an object that is created:\n\nclass Car:\n    def __init__(self,make,model,year):\n        self.make = make\n        self.model = model\n        self.year = year\n    def print_car(self):\n        print(f\"Car: {self.make} {self.model} {self.year}\")\n\ncar1 = Car(\"Ford\",\"Bronco\",2022)\n\nclass = keyword to define a class\ndef __init__() = class constructor, a method called automatically to initialize an object's attributes\nself = represents an instance of the class that allows you to access its attributes and methods\nmake, model, and year = class attributes\nprint_car = a method inside Car class that will print out it's attributes\ncar1 = an object created using Car class\n\nTo access the object's attributes and methods, you must use the object's name.\ncar1.make → Ford\ncar1.model → Bronco\ncar1.year → 2022\ncar1.print_car() → Car: Ford Bronco 2022\n\nNote: Methods are called with parentheses because they are functions",
          order: 8,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for classes",
              items: [
                "_____ Album:\n    def _______(____,genre,name,artist,year,awards):\n        self.genre = _____\n        self.name = _____\n        self.artist = _____\n        self.year = _____\n        self.awards = _____\n    def display(_____):\n        print(f\"Genre: {________}\")\n        print(f\"Album Name: {________}\")\n        print(f\"Artist Name: {________}\")\n        print(f\"Year of Release: {________}\")\n    def has_awards(_____):\n        if(___(self.awards) __ 0):\n            print(\"This album has no awards!\")\n        else:\n            print(\"This album has awards!\")\n            ___ award in ________:\n                print(award)\n\nalbum1 = Album(\"Pop\",\"HIT ME HARD AND SOFT\",\"Billie Eilish\",2024,[])\nalbum2 = Album(\"Country\",\"One Thing At A Time\",\"Morgan Wallen\", 2023,[\"Billboard's Top Album of the Year\"])\n\nalbum1.display()\nalbum1.has_awards()\nprint('\\n') # print new line\nalbum2.display()\nalbum2.has_awards()"
              ]
            }
          ]
        },
        {
          title: "Handling Errors",
          content: "Error handling is one of the most important concepts in programming. Some languages provide an easy way to handle errors, while others are a little more difficult. Fortunately, Python has a simple approach on how to handle errors using try/expect statements.\n\nThe try block contains a line, or lines, of code that is going to attempt to execute. If it fails, the expect block will \"catch\" the error and you can print the reason for the error. A common example is dividing by 0.\n\ntry:\n    x = 5 / 0\nexcept ZeroDivisionError as e:\n    print(f\"Error: {e}\")\n\nZeroDivisionError is a common error in Python. The try block tries to execute 5 divided by 0, however, it is undefined. \"e\" contains the type of error. The output looks like this:\n\nError: division by zero\n\nTry/expect statements allow the program to continue running without terminating execution. This is very useful for developers to understand what specific piece of code is not working correctly. Errors can also be created by the programmer to check something. For example, if a user wants to withdraw money from their bank, their identity should be verified first. If they have the wrong credentials, an error will be thrown.",
          order: 9,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - Error Types",
              description: "Fill in the correct error types for each code example",
              questions: [
                {
                  id: "q1",
                  text: "Handle dictionary and key errors:\n\ntry:\n    myDict = {\"apple\":2}\n    print(myDict[\"orange\"])\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "KeyError" }
                  ]
                },
                {
                  id: "q2",
                  text: "Handle list index errors:\n\ntry:\n    myList = [1,5,3]\n    print(myList[6])\nexcept ________ as e:\n    print(f\"Error: {e}\")\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                  blanks: [
                    { id: "b2", position: 1, correctAnswer: "IndexError" },
                    { id: "b3", position: 2, correctAnswer: "TypeError" }
                  ]
                }
              ],
              possibleAnswers: [
                "KeyError", "IndexError", "TypeError", "ValueError", "SyntaxError"
              ]
            }
          ]
        },
        {
          title: "Project",
          content: "This is a mini project that will encapsulate everything that has been learned so far.\n\nFill in the blank: Create a class called student. Student will have a name, GPA (that is initialized to 0), a dictionary of classes and grades, and academicHonors (list initialized to empty string). It will have a method that displays their grades in each class and another one that displays their academic honors. The final method will calculate their GPA for the semester.\n\nAlso, create a class called teacher. Teacher will have a name and a list of students. It will have a method that displays the list of students and another method that determines what kind of academic honors that student deserves. Finally, it will have a method that prints out each student's GPA and honors.\n\nNOTE: Not all methods will be used in the code. It is extra practice!\n\nThe user is the teacher. Use the information below for user input.\nteacher = Mrs. Smith, [student1,student2,student3,student4,student5]",
          order: 10,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for the student and teacher classes",
              items: [
                "class Student:\n    def __init__(self,name,gpa,classes,academicHonors):\n        self.name = name\n        self.gpa = gpa\n        self.classes = classes\n        self.academicHonors = academicHonors\n    def calculate_gpa(self):\n        total = 0\n        for c in self.classes:\n            if(self.classes[c] == 'A'):\n                total = total + 4.0\n            elif(self.classes[c] == 'B'):\n                total = total + 3.0\n            elif(self.classes[c] == 'C'):\n                total = total + 2.0\n            elif(self.classes[c] == 'D'):\n                total = total + 1.0\n            else:\n                total = total + 0\n        self.gpa = total / len(self.classes)\n        self.gpa = round(self.gpa, 1)\n    def display_grades(self):\n        print(\"Semester Grades:\")\n        for c in self.classes:\n            print(f\"{c}: self.classes[c]\")\n    def display_honors(self):\n        print(f\"Academic Honors: {self.academicHonors}\")\n\nclass Teacher:\n    def __init__(self,name,students):\n        self.name = name\n        self.students = students\n    def determine_student_honors(self):\n        for student in self.students:\n            if(student.gpa == 4.0):\n                student.academicHonors = \"President's Honor Roll\"\n            elif(student.gpa >= 3.5):\n                student.academicHonors = \"Dean's List\"\n            elif(student.gpa >= 3.0):\n                student.academicHonors = \"Merit Roll\"\n            elif(student.gpa >= 2.5):\n                student.academicHonors = \"Academic Progress List\"\n            else:\n                student.academicHonors = \"Encouragement List\"\n    def display_students(self):\n        print(\"Students:\")\n        for student in self.students:\n            print(student)\n    def display_acknowledegment(self):\n        print(\"Final Acknowledgements: \")\n        for student in self.students:\n            print(\"---------------------------------\")\n            print(f\"{student.name}   {student.gpa}\")\n            print(student.academicHonors)\n\nstudent1 = Student(\"Gary Bryan\",0,{\"history\":\"A\",\"math\":\"C\",\"science\":\"B\",\"english\": \"A\", \"art\":\"A\"},'')\nstudent2 = Student(\"Ella Gilbert\",0,{\"history\":\"A\",\"math\":\"A\",\"science\":\"A\",\"english\": \"A\", \"photography\":\"A\"},'')\nstudent3 = Student(\"Tina Valeria\",0,{\"history\":\"B\",\"math\":\"D\",\"science\":\"C\",\"english\": \"C\", \"gym\":\"F\"},'')\nstudent4 = Student(\"Ben Marvin\",0,{\"history\":\"B\",\"math\":\"A\",\"science\":\"C\",\"english\": \"D\", \"music\":\"B\"},'')\nstudent5 = Student(\"Billy Hamilton\",0,{\"history\":\"B\",\"math\":\"A\",\"science\":\"B\",\"english\": \"A\", \"finance\":\"A\"},'')\n\nteacherName = input(\"What is your name: \")\nteacher = Teacher(teacherName, [student1,student2,student3,student4,student5])\nfor student in teacher.students:\n    student.calculate_gpa()\n\nteacher.determine_student_honors()\nteacher.display_acknowledegment()"
              ]
            }
          ]
        },
        {
          title: "Useful Imports",
          content: "import math\n\nMath will give you a lot of important math operations. These include:\n\nmath.add(4,2) → 6\nmath.subtract(4,2) → 2\nmath.multiply(4,2) → 8\nmath.divide(4,2) → 2\nmath.pow(4,2) → 16\nmath.sqrt(9) → 3\nmath.pi → 3.14…\nmath.trunc(2.3) → 2 (removes the decimal)\n\nThere are several more operations in math, but these are important ones to start off with.\n\nimport random\n\nThis library is useful to get random values. Here is an example with integers:\n\nrandom.randint(1,100) → 64\nrandint will give a random integer between 1 and 100 inclusive of both numbers.\n\nrandom.random() → 0.84748498484…\nrandom will generate a random float number between 0.0 and 1.0\n\nrandom.choice(myList)\nchoice will choose a random element in a list\n\nrandom.shuffle(myList)\nshuffle will reorder a list in a random order\n\nThere are more, but these are some common examples.\n\nimport datetime\n\nDatetime will give information about dates and times during the day.\n\ndatetime.date.today() → today's date (yyyy-mm-dd)\ndatetime.datetime(yyyy,mm,dd) → creates a specific date\n\nIn a practical sense, this library can be used to create timestamps.\n\nimport time\n\nTime library allows programmers to operate with anything related to execution time, delays, and timers.\n\ntime.sleep(2) → stop execution (wait) for 2 seconds\ntime.time() → get current time (used for timers)\n\nThere are multiple functions included in this library, but these are the basic operations.",
          order: 11,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for using imported libraries",
              items: [
                "import ______ as np\n\n# Create an array of numbers from 1 to 10\nnumbers = np.______(1, 11)\n\n# Calculate the square root of each number\nsquared = np.______(numbers)\n\nprint(squared)"
              ]
            }
          ]
        },
        {
          title: "Multiple Blanks Practice",
          content: "This section focuses on practicing Python code with multiple blanks in a single question.",
          order: 9,
          exercises: [
            {
              type: "multiBlankDragDrop",
              title: "Practice - Multiple Blanks per Question",
              description: "Fill in multiple blanks for each Python code snippet",
              questions: [
                {
                  id: "q1",
                  text: "Complete the function to calculate the area of a rectangle:\n\ndef calculate_area(____, _____):\n    return length * _____",
                  blanks: [
                    { id: "b1", position: 1, correctAnswer: "length" },
                    { id: "b2", position: 2, correctAnswer: "width" },
                    { id: "b3", position: 3, correctAnswer: "width" }
                  ]
                },
                {
                  id: "q2",
                  text: "Create a list comprehension that squares even numbers:\n\nnumbers = [1, 2, 3, 4, 5]\nsquared_evens = [x**2 for x in _____ if x % ____ == ____]",
                  blanks: [
                    { id: "b4", position: 1, correctAnswer: "numbers" },
                    { id: "b5", position: 2, correctAnswer: "2" },
                    { id: "b6", position: 3, correctAnswer: "0" }
                  ]
                },
                {
                  id: "q3",
                  text: "Write a for loop that prints each character of a string:\n\nword = \"Python\"\nfor ____ in range(len(____)): \n    print(word[____])",
                  blanks: [
                    { id: "b7", position: 1, correctAnswer: "i" },
                    { id: "b8", position: 2, correctAnswer: "word" },
                    { id: "b9", position: 3, correctAnswer: "i" }
                  ]
                }
              ],
              possibleAnswers: [
                "length", "width", "numbers", "2", "0", "i", "word"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Introduction to ROS 2",
      description: "Welcome to Module 2! From now on, you will be learning Python programming through practical robotic scenarios. In this specific module, you will be introduced to ROS, or Robot Operating System, concepts and the pre-built Gazebo robotic arm, UR5.",
      order: 2,
      sections: [
        {
          title: "What is ROS?",
          content: "In technological fields, operating systems (OS) manage various components of a computer, allowing them to work effectively with each other. When you press a button on the keyboard, the OS interprets this action and displays the correct symbol on the screen. By running software, operating hardware, and organizing memory, they make it easier for a user to focus on their own tasks without worrying about computer functionality.\n\nSimilarly, Robot Operating System (ROS) is a tool that developers need to build the several different pieces of a robot. Although it has \"operating system\" in its name, ROS is not an operating system but rather a framework that provides tools to make those various parts communicate with each other. For example, if you are constructing a robot with a motor, the motor needs to know how fast to move and which direction the vehicle needs to travel. Therefore, the motor controller node needs to communicate with the velocity and positioning nodes.\n\nNodes are programs that will perform a specific task for a robot. As mentioned above, the motor controller node will control the movement of a robot (e.g. the wheels). Each node will generally have one specified task for each component of the robot.",
          order: 1,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Publisher/Subscriber Matching",
              description: "In each scenario, match the node name to whether it acts like a publisher or subscriber. Think about which one would be sending data and which is receiving.",
              items: [
                { id: "email", text: "Sent Email Message", category: "Publisher" },
                { id: "outlook", text: "Outlook", category: "Subscriber" },
                { id: "doordash", text: "DoorDash Application", category: "Publisher" },
                { id: "customer_notif", text: "Customer Notification", category: "Subscriber" },
                { id: "amazon", text: "Amazon Website", category: "Subscriber" },
                { id: "order", text: "Customer Order", category: "Publisher" },
                { id: "graph", text: "Graph", category: "Subscriber" },
                { id: "coordinate", text: "Coordinate", category: "Publisher" },
                { id: "music", text: "Music on a phone", category: "Publisher" },
                { id: "headphones", text: "Headphones", category: "Subscriber" }
              ]
            }
          ]
        },
        {
          title: "ROS 2 Nodes",
          content: "Nodes are blocks of code that will execute certain tasks for a robot. We are going to use ROS 2, an upgraded version of ROS that is compatible with newer software. To properly create a ROS 2 node, you first need to import the necessary libraries and resources required for programming in Python. Without these, ROS nodes cannot perform their intended functions.\n\nFirst, when you intend to use ROS 2 functions, you need to import its library:\n\nimport rclpy\n\nThen, in order to create a node, you must import the Node class from the rclpy library:\n\nfrom rclpy.node import Node\n\nIMPORTANT functions:\nLog information to ROS 2 → self.get_logger().info('Running node…')\nCreate timers → self.create_timer(1, self.timer_callback)\n- In seconds\n- Callback function handles what happens during the timer",
          order: 2,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Create a Node",
              description: "Create a node called 'every_two_seconds' that will log information to ROS in 2 second increments.",
              items: [
                "#!/usr/bin/env python3",
                "import rclpy",
                "from rclpy.node import Node",
                "class MyNode(Node):",
                "def __init__(self):",
                "super().__init__('every_two_seconds')",
                "self.create_timer(2.0, self.print_message)",
                "def print_message(self):",
                "self.get_logger().info(\"Battery is fully charged…\")",
                "def main():",
                "rclpy.init()",
                "node = MyNode()",
                "rclpy.spin(node)",
                "rclpy.shutdown()",
                "if __name__ == '__main__':",
                "main()"
              ]
            }
          ]
        },
        {
          title: "ROS 2 Subscribers",
          content: "Subscribers listen for data. When writing them for a specific topic, it is important that the data message they are listening for is the same type as the data being published. For example, \"battery_message\" is a publisher that sends a String message saying the battery is empty. A user needs to be notified when this happens.\n\nTo create subscribers, the rclpy library provides a Subscriber function. It takes the type of data to listen for, the name of a topic, a function called every time data is received, and the queue size, or the maximum size of messages that can be stored at a time.\n\nBefore you create a subscriber, you need to know a few important things:\nsensor_msgs/BatteryState is a ROS 2 message type that contains various attributes related to a battery's status, including:\n- voltage = battery voltage\n- charge = remaining charge\n- capacity = charge capacity\n- percentage = current battery percentage\n- power_supply_status = charge status",
          order: 3,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Create a Subscriber",
              description: "Create a subscriber called 'blue_battery_status' that will log all battery information to ROS.",
              items: [
                "#!/usr/bin/env python3",
                "import rclpy",
                "from rclpy.node import Node",
                "from std_msgs.msg import Bool",
                "class BatteryInfo(Node):",
                "def __init__(self):",
                "super().__init__('blue_battery_status')",
                "self.subscription = self.create_subscription(",
                "BatteryState,",
                "'/model/vehicle_blue/battery/linear_battery/state',",
                "self.receive_message,",
                "10",
                ")",
                "def receive_message(self, msg):",
                "self.get_logger().info(f\"Voltage: {msg.voltage}\")",
                "self.get_logger().info(f\"Charge: {msg.charge}\")",
                "self.get_logger().info(f\"Capacity: {msg.capacity}\")",
                "self.get_logger().info(f\"Percentage: {msg.percentage}\")",
                "self.get_logger().info(f\"Power Status: {msg.power_supply_status}\")"
              ]
            }
          ]
        },
        {
          title: "ROS 2 Publishers",
          content: "ROS 2 topics act like bridges between nodes that send and receive data. A single topic can have multiple publishers and subscribers connected to it, each dealing with different types of data. However, for simplicity, you will start by creating a topic that has one publisher and subscriber, both sending and receiving the same type of data. Remember, a topic is not a physical file like publisher and subscriber nodes.\n\nIn ROS 2, a publisher is created by using the rclpy library. It takes three arguments: the type of data being published, the name of the topic, and the queue size.",
          order: 4,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - Create a Publisher",
              description: "Create a publisher that updates battery percentage and prints status messages based on the percentage level.",
              items: [
                "import rclpy",
                "from rclpy.node import Node",
                "from sensor_msgs.msg import BatteryState",
                "class UpdateBattery(Node):",
                "def __init__(self):",
                "super().__init__('update_blue_battery')",
                "self.publisher_ = self.create_publisher(",
                "BatteryState,",
                "'/model/vehicle_blue/battery/linear_battery/state',",
                "10",
                ")",
                "def update_battery(self, perc_list):",
                "msg = BatteryState()",
                "for perc in perc_list:",
                "msg.percentage = perc",
                "self.publisher_.publish(msg)",
                "percentage = round(perc*100)",
                "if percentage == 0:",
                "self.get_logger().info('Status: DEAD')",
                "elif percentage <= 20:",
                "self.get_logger().info('Status: LOW')"
              ]
            }
          ]
        }
      ]
    }
  ]
};

const importContent = async () => {
  try {
    // Create modules collection
    const modulesCollection = collection(db, 'modules');

    // Import each module
    for (const module of educationalContent.modules) {
      // Add module
      const moduleRef = await addDoc(modulesCollection, {
        title: module.title,
        description: module.description,
        order: module.order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Add pre-assessment
      if (module.preAssessment) {
        await setDoc(doc(moduleRef, 'preAssessment', 'questions'), {
          questions: module.preAssessment.questions
        });
      }

      // Create sections subcollection
      const sectionsCollection = collection(moduleRef, 'sections');

      // Import sections
      for (const section of module.sections) {
        const sectionRef = await addDoc(sectionsCollection, {
          title: section.title,
          content: section.content,
          order: section.order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Create exercises subcollection
        const exercisesCollection = collection(sectionRef, 'exercises');

        // Import exercises
        for (const exercise of section.exercises) {
          await addDoc(exercisesCollection, {
            type: exercise.type,
            title: exercise.title,
            description: exercise.description,
            items: exercise.items,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    console.log('Content imported successfully');
  } catch (error) {
    console.error('Error importing content:', error);
  }
};

// Run the import
importContent(); 