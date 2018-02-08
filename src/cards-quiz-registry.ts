/**
 * @module jqCardsQuiz
 *//** */
/**
 * Options for CardsQuizRegistry
 */
export interface CardsQuizCardRegistryOptions{
    /**
     * Root element of the flip widget
     */
    element?:JQuery;
    /**
     * Id or index of the related question in the quiz
     */
    question?:string;
    /**
     * Ids of the answers for the question
     */
    answersIds?:string[];
    /**
     * Values of the answers for the question.
     * Could be undefined
     */
    answersValues?:string[];
    /**
     * The question is correct or incorrect
     */
    isCorrect?:boolean;
    /**
     * Options for the flip widget
     */
    flipOptions?:any;
}

/**
 * Manage a card
 */
export class CardsQuizCardRegistry implements CardsQuizCardRegistryOptions{
    /**
     * Root element of the flip widget
     */
    element:JQuery;
    /**
     * Id or index of the related question in the quiz
     */
    question:string;
    /**
     * Ids of the answers for the question
     */
    answersIds:string[]=[];
    /**
     * Values of the answers for the question.
     * Could be undefined
     */
    answersValues:string[]=[];
    /**
     * The question is correct or incorrect
     */
    isCorrect:boolean;
    /**
     * Options for the flip widget
     */
    flipOptions:any;

    /**
     * Instance of the flip widget
     */
    instance:any;
    constructor(params:CardsQuizCardRegistryOptions={}){
        if(params.element != undefined){
            this.element = params.element;
        }
        if(params.question != undefined){
            this.question = params.question;
        }
        if(params.answersIds != undefined){
            this.answersIds = params.answersIds;
        }
        if(params.answersValues != undefined){
            this.answersValues = params.answersValues;
        }
        if(params.isCorrect != undefined){
            this.isCorrect = params.isCorrect;
        }
        if(params.flipOptions != undefined){
            this.flipOptions = params.flipOptions;
        }
        this.init();
    }

    /**
     * Turn the card
     */
    flip(){
        this.instance.flip();
    }

    /**
     * Restore the card
     */
    unflip(){
        this.instance.unflip();
    }

    /**
     * Detach the instance of the flip widget
     */
    detachFlip(){
        this.element.off(".flip");
    }

    /**
     * True if the card is flipped, otherwise false
     * @returns {boolean}
     */
    get isFlipped():boolean{
        return this.instance.isFlipped;
    }
    /**
     * Initialize the widget
     */
    protected init(){
        if(this.element) {
            this.detachFlip();
            //@ts-ignore
            this.element.flip(this.flipOptions);
            this.instance = this.element.data("flipModel");
        }
    }
}