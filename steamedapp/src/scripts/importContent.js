import { db } from '../firebase/config';
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
              title: "Practice - drag and drop correct data type",
              description: "Match the variables with their correct data types",
              items: [
                "personName = _______",
                "integerNum = _______",
                "decimalNum = _______",
                "dogName = _______",
                "numList = _______",
                "setList = _______",
                "trueBool = ______",
                "falseBool = ______",
                "myDictionary = ________",
                "myTuple = ________"
              ]
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
              title: "Practice - drag and drop correct naming",
              description: "Match the variables with their correct names",
              items: [
                "______ = 3.14",
                "______ = 'strawberry'",
                "______ = 9 + 2",
                "______ = [\"a\", \"b\", \"c\"]",
                "______ = (x,y)",
                "______ = {'socks':3, 'shirt':5, 'pants':6}",
                "______ = True"
              ]
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
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct comparison operator results",
              items: [
                "print(1 > 0) ______",
                "print(2 != 2) ______",
                "print(hi == hi) _______",
                "print(4 >= 1) ______",
                "print(16 <= 16) ______",
                "print(2 < 1) ______"
              ]
            }
          ]
        },
        {
          title: "If Statements & Loops",
          content: "In programming, if statements are used to execute a block of code if a conditional statement evaluates to true. For example, if a variable isOff is true, then turn the light on (isOff = False).\n\nIf you want to test another condition, Python has the keyword \"elif\". You can use this keyword as many times in between \"if\" and \"else\" statements. The else statement is executed when all conditional statements fail.\n\nBelow shows the format:\n\nif (condition):\n    # code\nelse:\n    # code\n\nif (condition #1):\n    # code\nelif (condition #2):\n    # code\nelse:\n    # code\n\nLoops are used in programming when an action needs to be repeated a certain number of times. There are three different kinds of loops: for loop, while loop, and nested loops.\n\nFor loops are extremely useful when iterating, or stepping, through a sequence of elements. For example, a list.\n\ncolors = ['red', 'blue', 'green']\nfor color in colors:\n    print(color)\n\n\"color\" refers to an element in the list while \"colors\" is the list itself. You can choose the name of the elements in the for loop, however, it should have meaning. Another important format of the for loop is using the range keyword. This is used when the programmer wants a block of code to be repeated a specific number of times without using something like a list.\n\nfor i in range(3):\n    print(i)\n\n\"i\" is the typical naming for an element. It is important to note that \"range(3)\" will not count using 1,2, and 3. Instead, Python begins at 0 so, the iteration will be 0,1, and 2.\n\nWhile loops will run a block of code as long as a condition is true. For example, the code below will keep printing \"The list is empty.\" until isEmpty is evaluated to false.\n\nisEmpty = True\nwhile(isEmpty):\n    print('The list is empty.\\n')\n\nNote: \"while(isEmpty)\" is a shorter way of stating \"while(isEmpty == True)\" and \"\\n\" means new line which will print the string on a new line in the output.\n\nHowever, this example is not practical because it will get stuck in an infinite loop, meaning there is nothing stopping the loop from terminating. When using while loops, make sure there is a condition that will allow the loop to stop.\n\nNested loops are useful when working with multidimensional data. In mathematics, matrices exist.\n\n0 1\n2 3\n\nIf you want to replicate this structure in code, it will look like lists inside of a list.\n\nmatrix = [[0,1],[2,3]]\n\nIn order to traverse, or iterate, through the list, you need a nested loop. Using for loops, this can be achieved.\n\nfor row in matrix:\n    for num in row:\n        print(num)\n\nOutput:\n0\n1\n2\n3\n\nThe nested loop will first iterate through a row, and then iterate through each element in that row.",
          order: 4,
          exercises: [
            {
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for if statements and loops",
              items: [
                "x = 4\nif (x > 3):\n    print('Hello')\nelse:\n    print('World')\n\nOutput: __________",
                "total = 21.50\napplePrice = 2.00\norangePrice = 1.50\npeachPrice = 3.00\n\nif (applePrice < 2):\n    ______ = total + ______\n    print(______)\n____ (orangePrice < 2):\n    total = __________\n    print(total)\n____:\n    ______________\n_____(total)\nOutput: 23.00",
                "states = [\"Ohio\", \"Wisconsin\", \"Florida\", \"Arizona\"]\nfor state __ ______:\n    if (______ == Florida):\n        print(\"Go Knights!\")\nOutput: Go Knights!",
                "x = 3\nfor _ in range(_):\n    x = ____ * 3\n    print(x)\nOutput:\n3\n6\n9\n12\n15",
                "balance = 100\ncookiePrice = 2.50\ntotalCookies = 0\n\n_____(balance _ 0):\n    _______ = balance - _________\n    totalCookies = _________ + _\n    print(totalCookies)\nOutput: _______",
                "shoes = [[\"Nike\",8],[\"New Balance\",10],[\"Adidas\",7]]\n___ shoe in _____:\n    for element in ____:\n        print(_______, end=' ')\n    print()\nOutput:\nNike _\nNew Balance 10\n_____ 7"
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
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for data structures",
              items: [
                "Tuple Unpacking: Traverse the coordinate list to decrease the x value by 1 and increase the y value by 1.\n\ncoordinateList = [(2,8),(7,3),(2,1)]\nfor ___ in __________:\n    x = _____\n    y = _____\n    print(x,y)",
                "set1 = {1,8,4,5,7,3}\nset2 = {2,3,9,4,5,6,1}\n\nset1.union(set2) ________\nlen(set1) ________\nset1.intersection(set2) ________\nset1.difference(set2) ________\nset2.difference(set1) ________\nlen(set2) ________",
                "Fill in the blank: Update the address street to 5678 Longhorn Dr. and delete the key \"age\" because it doesn't belong in an address.\n\naddress = {'streetNum':1234,'streetName':'Berry Ln.','city':'Fruit City','state':'Texas','zip':67543,'age':7}\n\naddress.______({'streetNum':_____, _______:_______}\n___ address[____]\nprint(address)",
                "Fill in the blank: Add a flamingo to the list and sort the animals. Then count how many animals in the animals list are also pets. Print out the result.\n\nanimals = [\"zebra\",\"lion\",\"dog\",\"cat\"]\npets = [\"cat\",\"fish\",\"dog\",\"hamster\"]\npetCount = 0\n\nanimals._______(________)\nanimals._____\n___ animal in _______:\n    for pet __ ____:\n        __ (animal ___ pet):\n            petCount = ______ + _\nprint(petCount)",
                "Fill in the blank: Properly create the array and find the double-digit number and delete it.\n\nimport ______ as np\nnums = ______([2,3,5,6,7,11,9])\nnewNums = []\nfor i in range(len(___)):\n    if(_____ >= 10):\n        newNums = np.delete(nums, _)\nprint(newNums)"
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
              type: "dragAndDrop",
              title: "Practice - drag and drop fill in the blank",
              description: "Fill in the correct code for functions",
              items: [
                "___ get_user_name():\n    name = ______(\"Name: \")\n    print(______)\n\n_______________",
                "___ temperature_conversion(____):\n    celsius = (temp – 32)/1.8\n    ______ celsius\n\nfahrenheit = 70\ncelsius = ______________(________)"
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
              type: "dragAndDrop",
              title: "Practice - drag and drop match",
              description: "Match the correct error types with their examples",
              items: [
                "try:\n    myDict = [\"apple\":2]\n    print(myDict[\"orange\"])\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                "try:\n    myList = [1,5,3]\n    print(myList[6])\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                "try:\n    print(\"hello\"\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                "try:\n    1 + 'two'\nexcept ________ as e:\n    print(f\"Error: {e}\")",
                "try:\n    if(x > 6):\n        print(\"Greater than 6\")\nexcept ________ as e:\n    print(f\"Error: {e}\")"
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