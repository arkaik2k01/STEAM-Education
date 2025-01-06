//Declare a basic fallback support for Python in case of a failed connection
export function pyRegister(monaco) {
    monaco.languages.register({id: 'python'});
    monaco.languages.setMonarchTokensProvider('python', {
        tokenizer: {
            root: [
                // Python keywords
                [/(def|class|return|if|else|elif|import|from|as|try|except|with|yield|global|nonlocal|assert|break|continue|del|pass|raise|finally)/, 'keyword'],
        
                // Constants
                [/(True|False|None|NotImplemented|Ellipsis)/, 'constant'],
        
                // ROS-related keywords (like rospy, rosmsg, etc.)
                [/(ros|rospy|roslib|rosparam|rosmsg|rosnode|rospy.Publisher|rospy.Subscriber|rospy.init_node)/, 'ros-keyword'],
        
                // ROS message types (e.g., std_msgs/String, geometry_msgs/Twist)
                [/(?:[a-zA-Z_][\w]*)(?=\s*\/[a-zA-Z_][\w]*)/, 'ros-message'],
        
                // Variable names (self for methods)
                [/(self|cls)/, 'variable'],
        
                // Identifiers (variable names, function names, etc.)
                [/[a-zA-Z_][\w]*/, 'identifier'],
        
                // Strings (both single and double quotes)
                [/"(.*?)"|'(.*?)'/, 'string'],
        
                // Numbers (integers and floats)
                [/\b\d+(\.\d+)?\b/, 'number'],
        
                // Operators (arithmetic and assignment)
                [/(+|-|\*|\/|%|==|=|>|<|>=|<=|\+=|-=|\*=|\/=|%=)/, 'operator'],
        
                // Punctuation (brackets, parentheses, commas)
                [/[()\[\]\{\}\.,;\:\?#!\$\%\^&\*\+\-\/=\<\>]/, 'punctuation'],
        
                // Comments (single-line)
                [/#.*/, 'comment']
            ],
        },               
    });
}