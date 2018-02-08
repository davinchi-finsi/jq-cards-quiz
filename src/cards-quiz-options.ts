/**
 * @module jqCardsQuiz
 *//** */
export interface CardsQuizOptions{
    /**
     * Namespace for events
     * @default jq-crossword
     */
    namespace?: string;
    /**
     * Disable the widget
     * @default false
     */
    disabled?:boolean;
    /**
     * Name of the attribute with the question index/id
     * @default data-cq-question
     */
    questionAttribute?:string;
    /**
     * Css classes to use
     */
    classes?: {//css classes for elements
        /**
         * Root element
         * @default c-cards-quiz
         */
        root?: string;
        /**
         * Class for the disabled state
         * @default `c-cards-quiz--disabled`
         */
        disabled?: string;
        /**
         * Class for the quiz
         * @default `c-cards-quiz__quiz`
         */
        quiz?:string;
        /**
         * Class for the cards wrapper
         * @default `c-cards-quiz__cards`
         */
        cardsWrapper?:string;
        /**
         * Class for the cards
         * @default `c-cards-quiz__card`
         */
        card?:string;
        /**
         * Class for cards with correct answer
         * @default `c-cards-quiz__card--correct`
         */
        cardIsCorrect?:string;
        /**
         * Class for cards with incorrect answer
         * @default `c-cards-quiz__card--incorrect`
         */
        cardIsIncorrect?:string;
        /**
         * Class for the card active
         * @default `c-cards-quiz__card--active`
         */
        cardActive?:string;
    },
    /**
     * Selectors to get the elements involved in the widget
     * **Please note** that all the selectors will be executed inside of the widget root element
     */
    selectors?:{
        /**
         * JQuery selector to get the cards wrapper
         * @default `[data-cq-cards]`
         */
        cardsWrapper?:string;
        /**
         * JQuery selector to get the card. Will be executed in the context of cardsWrapper
         * @default `[data-cq-card]`
         */
        card?:string;
        /**
         * JQuery selector to get the element for which to initialize the jq-quiz plugin
         * @default `[data-cq-quiz]`
         */
        quiz?:string;

    },
    /**
     * Options to pass to each card
     * @see [flip docs](http://nnattawat.github.io/flip/)
     */
    flip?:any;
    /**
     * Options to pass to the quiz widget
     * @see [jqQuiz docs](https://davinchi-finsi.github.io/jq-quiz/options.html)
     */
    jqQuiz?:any;
}