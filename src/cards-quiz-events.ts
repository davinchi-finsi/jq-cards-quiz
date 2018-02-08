/**
 * @module jqCardsQuiz
 *//** */

import {CardsQuizGame} from "./cards-quiz-game";
import {CardsQuizCardRegistry} from "./cards-quiz-registry";

/**
 * onCardFlip event
 * @example ```javascript
 * $("someSelector").on("cardsQuiz:cardFlip",(e,data:CardsQuizCardFlippedEvent)=>{
 *  console.log(data);
 * });
 * ```
 */
export interface CardsQuizCardFlipEvent{
    /**
     * Instance of cardsQuiz that triggers the event
     */
    instance:CardsQuizGame;
    /**
     * Card registry
     */
    card:CardsQuizCardRegistry;
}
/**
 * onQuestionChange event
 * @example ```javascript
 * $("someSelector").on("cardsQuiz:questionChange",(e,data:CardsQuizQuestionChangeEvent)=>{
 *  console.log(data);
 * });
 * ```
 */
export interface CardsQuizQuestionChangeEvent{
    /**
     * Instance of cardsQuiz that triggers the event
     */
    instance:CardsQuizGame;
    /**
     * Card registry related to the question.
     */
    card:CardsQuizCardRegistry;
    /**
     * Data about the question and option
     */
    questionChange:{
        /**
         * Question id
         */
        questionId:string;
        /**
         * The id of the option selected or unselected
         */
        optionId:string;
        /**
         * The value of the option selected or unselected
         * Could be null
         */
        optionValue:string;
    }
}
/**
 * onCardFlip event
 * @example ```javascript
 * $("someSelector").on("cardsQuiz:cardFlip",(e,data:CardsQuizCardFlippedEvent)=>{
 *  console.log(data);
 * });
 * ```
 */
export interface CardsQuizEndEvent{
    /**
     * Instance of cardsQuiz that triggers the event
     */
    instance:CardsQuizGame;
    /**
     * JqQuiz calification
     */
    calification:any;
}
/**
 * Available events
 */
export enum CardsQuizEvents{
    /**
     * Triggered when a card has been flipped
     * @see [[CardsQuizCardFlipEvent]]
     * @example ```
     * $("someSelector").on("cardsQuiz:cardFlip",(e,data)=>{console.log(data)});
     * ```
     */
    onCardFlip = "cardsQuiz:cardFlip",
    /**
     * Triggered when an option of a question changes
     * @see [[CardsQuizQuestionChangeEvent]]
     * @example ```
     * $("someSelector").on("cardsQuiz:questionChange",(e,data)=>{console.log(data});
     * ```
     */
    onQuestionChange = "cardsQuiz:questionChange",
    /**
     * Triggered when the quiz ends
     * @see [jqQuiz end event](https://davinchi-finsi.github.io/jq-quiz/events)
     * @see [[CardsQuizEndEvent]]
     * @example ```
     * $("someSelector").on("cardsQuiz:end",(e,data)=>{console.log(data});
     * ```
     */
    onEnd="cardsQuiz:end"
}