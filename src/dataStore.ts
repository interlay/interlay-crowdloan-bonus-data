import { response } from "express";
import { QUIZ_CONTRIBUTION_DEADLINE } from "./constants";

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

export function addressCompletedQuiz(address: string): boolean {
    for(const response of getQuizData().data) {
        const submissionDatetime = new Date(response["Submit Date (UTC)"]);
        const crowdloanEnd = new Date(QUIZ_CONTRIBUTION_DEADLINE);
        if(submissionDatetime > crowdloanEnd) {
            continue;
        }

        // English version and Chinese version:
        // - "You've finished the quiz and scored full marks!" (Aqkwhf1nRZRt)
        // - "完成测试，满分！" (pmWHGnNVycLi)
        if(
            response["You've finished the quiz and scored full marks!"] === address ||
            response["完成测试，满分！"] === address
        ) {
            return true;
        }
    }
    return false;
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
