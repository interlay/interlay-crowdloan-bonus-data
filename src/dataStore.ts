// Since this is stored in-memory, there are no issues if multiple instances are deployed
export interface QuizData {
    data: any[];
}

let quizData: QuizData = {
    data: []
};

export function getQuizData(): QuizData {
    return quizData;
}

export function setQuizData(newQuizData: QuizData) {
    quizData = newQuizData;
}

export interface TestnetData {
    data: any[];
}

let testnetData: TestnetData = {
    data: []
}

export function getTestnetData(): TestnetData {
    return testnetData;
}

export function setTestnetData(newTestnetData: TestnetData) {
    testnetData = newTestnetData;
}
