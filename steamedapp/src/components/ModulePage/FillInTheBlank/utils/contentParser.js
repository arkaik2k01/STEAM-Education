/**
 * Parse fill-in-the-blank content based on its format
 * 
 * @param {Object} content - The exercise content to parse
 * @returns {Object} Parsed content with type, segments and possibleAnswers
 */
export const parseFillInBlankContent = (content) => {
    // Default values
    let segments = [];
    let possibleAnswers = content.possibleAnswers || [];
    
    // Always use the explicit type field if available
    const exerciseType = content.type || 'unknown';
    
    // Parse based on the explicit type field
    if (exerciseType === 'dragAndDrop') {
        segments = parseDragAndDropContent(content);
    } else if (exerciseType === 'multiBlankDragDrop') {
        segments = parseMultiBlankContent(content);
    }
    // Other types can be added here in the future

    return { type: exerciseType, segments, possibleAnswers };
};

/**
 * Parse content for the drag-and-drop exercise type (itemized questions)
 * 
 * @param {Object} content - The drag-and-drop exercise content
 * @returns {Array} Array of text and blank segments
 */
const parseDragAndDropContent = (content) => {
    const segments = [];
    let blankIndex = 0;

    if (content.items && Array.isArray(content.items)) {
        content.items.forEach((item, index) => {
            const text = item.text || `Question ${index + 1}`;
            const correctAnswer = item.category || '';
            const itemId = item.id || `item-${index}`;

            // Parse the text to look for actual underscores for blanks
            const regex = /_{1,}/g; // Match 1 or more consecutive underscores
            let lastIndex = 0;
            let match;
            let hasBlank = false;

            // Try to find blanks in the text using regex
            while ((match = regex.exec(text)) !== null) {
                // Add the text segment before this blank
                if (match.index > lastIndex) {
                    segments.push({
                        type: 'text',
                        content: text.substring(lastIndex, match.index),
                        id: `text-${itemId}-${lastIndex}`
                    });
                }

                // Add the blank with the correct answer
                segments.push({
                    type: 'blank',
                    id: `blank-${blankIndex}`,
                    itemId: itemId,
                    correctAnswer: correctAnswer
                });

                blankIndex++;
                hasBlank = true;

                // Update lastIndex to continue after this blank
                lastIndex = match.index + match[0].length;
            }

            // Add any remaining text after the last blank
            if (lastIndex < text.length) {
                segments.push({
                    type: 'text',
                    content: text.substring(lastIndex),
                    id: `text-${itemId}-end`
                });
            }

            // If no blanks were found using regex, add the text and a separate blank
            // This is a fallback for older format items
            if (!hasBlank) {
                // Add the text as a segment
                segments.push({
                    type: 'text',
                    content: text,
                    id: itemId
                });

                // Add a blank for this item
                segments.push({
                    type: 'blank',
                    id: `blank-${blankIndex}`,
                    itemId: itemId,
                    correctAnswer: correctAnswer
                });

                blankIndex++;
            }
        });
    }

    return segments;
};

/**
 * Parse content for the multi-blank drag-and-drop exercise type
 * 
 * @param {Object} content - The multi-blank exercise content
 * @returns {Array} Array of question objects, each with its own segments
 */
const parseMultiBlankContent = (content) => {
    // We'll return an array of question objects, each with its own segments
    const result = [];

    if (!content.questions || !content.questions.length) {
        return result;
    }

    // Process each question
    content.questions.forEach((question, questionIndex) => {
        const segments = [];
        
        // First build a map of correct answers from the blanks array for this question
        const correctAnswersMap = {};
        
        if (question.blanks && Array.isArray(question.blanks)) {
            // Log blanks data for debugging
            console.log(`Question ${questionIndex} blanks:`, JSON.stringify(question.blanks));
            
            question.blanks.forEach(blank => {
                // Handle both zero-based and one-based positioning
                // If position is defined as a number, use it (adjusting if one-based)
                // Otherwise assign sequential positions
                let position;
                
                if (typeof blank.position === 'number') {
                    // Check if the content follows 1-based indexing
                    // This is a heuristic - if we have a position "0" anywhere, assume 0-based indexing
                    const hasZeroPosition = question.blanks.some(b => b.position === 0);
                    
                    // If no 0-indexed positions are found, and this position is > 0,
                    // assume 1-based indexing and adjust
                    if (!hasZeroPosition && blank.position > 0) {
                        position = blank.position - 1; // Convert from 1-based to 0-based
                    } else {
                        position = blank.position; // Already 0-based
                    }
                } else {
                    // No explicit position, use the current map size as position
                    position = Object.keys(correctAnswersMap).length;
                }
                
                correctAnswersMap[position] = blank.correctAnswer;
                console.log(`Mapped position ${position} to answer "${blank.correctAnswer}"`);
            });
        }

        // Use regex to find blanks (consecutive underscores)
        const regex = /_{2,}/g; // Match 2 or more consecutive underscores
        let lastIndex = 0;
        let blankIndex = 0;
        let match;
        const text = question.text || '';

        // Find all matches of consecutive underscores
        while ((match = regex.exec(text)) !== null) {
            // Add the text segment before this blank
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index),
                    id: `q${questionIndex}-text-${blankIndex}`
                });
            }

            // Get the correct answer for this position if available
            const correctAnswer = correctAnswersMap[blankIndex] || '';
            console.log(`Blank ${blankIndex} mapped to answer "${correctAnswer}"`);

            // Add the blank with a unique ID that includes the question index
            segments.push({
                type: 'blank',
                id: `q${questionIndex}-blank-${blankIndex}`,
                position: blankIndex,
                correctAnswer: correctAnswer,
                questionIndex: questionIndex
            });
            blankIndex++;

            // Update lastIndex to continue after this blank
            lastIndex = match.index + match[0].length;
        }

        // Add any remaining text after the last blank
        if (lastIndex < text.length) {
            segments.push({
                type: 'text',
                content: text.substring(lastIndex),
                id: `q${questionIndex}-text-end`
            });
        }

        // Add this question's segments to the result
        result.push({
            questionIndex,
            segments,
            title: question.title || `Question ${questionIndex + 1}`
        });
    });

    return result;
};