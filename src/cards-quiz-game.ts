/**
 * @module jqCardsQuiz
 */
/** */
import "flip";
import {CardsQuizOptions} from "./cards-quiz-options";
import {CardsQuizCardRegistry} from "./cards-quiz-registry";
import {
    CardsQuizCardFlipEvent,
    CardsQuizEndEvent,
    CardsQuizEvents,
    CardsQuizQuestionChangeEvent
} from "./cards-quiz-events";

/**
 * Cards quiz game
 */
export class CardsQuizGame{
    /**
     * Root element of the plugin
     */
    protected element: JQuery;
    /**
     * Current options
     */
    protected options: CardsQuizOptions;
    /**
     * Disabled state
     */
    protected disabled: boolean;
    /**
     * jqQuiz element
     */
    protected quiz:JQuery;
    /**
     * Cards wrapper element
     */
    protected cardsWrapper:JQuery;
    /**
     * Cards elements
     */
    protected cards:JQuery;
    /**
     * Registry of cards indexed by question id or index
     */
    protected cardsRegistry:{[key:string]:CardsQuizCardRegistry};
    /**
     * Active card
     */
    protected currentCard:CardsQuizCardRegistry;
    /**
     * Instance of the jq quiz widget
     */
    protected quizInstance:any;
    /**
     * Flag to control if a card is in transition
     */
    protected isCardInTransition:boolean;
    /**
     * Disable the widget
     */
    disable() {
        //@ts-ignore
        this._super();
        this.element.addClass(this.options.classes.disabled);
        this.quizInstance.disable();
    }

    /**
     * Enable the widget
     */
    enable() {
        //@ts-ignore
        this._super();
        this.element.removeClass(this.options.classes.disabled);
        this.quizInstance.enable();
    }

    /**
     * Activate a card by the question id or question index
     * @param questionIdOrIndex     Id or index of the question to activate. If null, the current card will be deactivated
     */
    activateCard(questionIdOrIndex:string|number){
        if(!this.options.disabled && !this.isCardInTransition) {
            if (questionIdOrIndex != undefined) {
                let card = this.cardsRegistry[questionIdOrIndex];
                if (card) {
                    this.isCardInTransition = true;
                    if (this.currentCard != undefined && this.currentCard != card) {
                        this.currentCard.element.removeClass(this.options.classes.cardActive);
                        if (this.currentCard.answersIds == undefined || this.currentCard.answersIds.length == 0) {
                            this.quizInstance.goTo(null);
                            this.currentCard.unflip();
                        }
                    }
                    if (this.currentCard == undefined || this.currentCard != card) {
                        this.currentCard = card;
                        card.element.addClass(this.options.classes.cardActive);
                        if (!card.instance.isFlipped) {
                            card.flip();
                        } else {
                            this.quizInstance.goTo(questionIdOrIndex);
                        }
                    }else{
                        this.isCardInTransition = false;
                    }
                }
            } else {
                if (this.currentCard) {
                    this.isCardInTransition = true;
                    this.quizInstance.goTo(null);
                    this.currentCard.element.removeClass(this.options.classes.cardActive);
                    this.currentCard.unflip();
                }
            }
        }
    }
    /**
     * JQuery ui function to get the default options
     * 
     */
    protected _getCreateOptions() {
        let options: CardsQuizOptions = {
            namespace: "jq-cards-quiz",
            questionAttribute:"data-cq-question",
            classes: {//css classes for elements
                root: "c-cards-quiz",
                disabled: "c-cards-quiz--disabled",
                quiz:"c-cards-quiz__quiz",
                cardsWrapper:"c-cards-quiz__cards",
                card:"c-cards-quiz__card",
                cardIsCorrect:"c-cards-quiz__card--correct",
                cardIsIncorrect:"c-cards-quiz__card--incorrect",
                cardActive:"c-cards-quiz__card--active"
            },
            selectors:{
                cardsWrapper:"[data-cq-cards]",
                card:"[data-cq-card]",
                quiz:"[data-cq-quiz]"
            },
            flip:{

            },
            jqQuiz:{

            }
        };
        return options;
    }
    /**
     * JQuery ui widget constructor
     * @constructor
     * 
     */
    protected _create() {
        this.element.addClass(this.options.classes.root);
        //force flip to manual to manage the disable state
        this._init();
        this._assignEvents();
    }

    /**
     * Initialize the widget
     * 
     */
    protected _init(){
        //inspect the dom
        //get cards wrapper
        this.cardsWrapper = this.element.find(this.options.selectors.cardsWrapper).addClass(this.options.classes.cardsWrapper);
        //get cards
        this.cards = this.cardsWrapper.find(this.options.selectors.card).addClass(this.options.classes.card);
        //get quiz
        this.quiz = this.element.find(this.options.selectors.quiz).addClass(this.options.classes.quiz);
        //instantiate quiz
        //force some options in the quiz
        let quizOptions = $.extend(true,{},this.options.jqQuiz,{autoStart:true,initialQuestion:null,autoGoNext:false});
        //@ts-ignore
        this.quiz.jqQuiz(quizOptions);
        //@ts-ignore
        this.quizInstance = this.quiz.jqQuiz("instance");
        this.cardsRegistry = {};
        //instantiate cards
        for(let cardIndex = 0, cardsLength = this.cards.length; cardIndex < cardsLength; cardIndex++){
            let currentCard = this.cards.eq(cardIndex),
                question = currentCard.attr(this.options.questionAttribute);
            if(question != undefined){
                let flipOptions:any = this._getDataOptions(currentCard,"flip"),
                    registry;
                flipOptions = Object.keys(this._getDataOptions(currentCard,"flip")).length > 0 ? flipOptions : this.options.flip;
                flipOptions.trigger ="manual";
                registry = new CardsQuizCardRegistry({
                    element:currentCard,
                    question:question,
                    flipOptions:flipOptions
                });
                this.cardsRegistry[question] = registry;
            }else{
                throw "[CardsQuizGame] The card must have a question"
            }
        }
    }

    /**
     * Invoked when a question of the quiz changes
     * Update the registry
     * @emits [[CardsQuizEvents.onQuestionChange]]
     * @param e                 Event object
     * @param quizInstance      jqQuiz instance that emits the event
     * @param questionId        The question id modified
     * @param optionId          The id of the option selected/unselected
     * @param optionValue       The value of the option selected/unselected
     * @param questionRuntime   The runtime of the question in jqQuiz
     * @see [[https://davinchi-finsi.github.io/jq-quiz/runtime]]
     */
    protected _onQuizChange(e:Event,quizInstance:any,questionId:string,optionId:string,optionValue:string,questionRuntime:any){
        this.currentCard.answersIds = questionRuntime.options;
        this.currentCard.answersValues = questionRuntime.optionsValues;
        this.currentCard.isCorrect = questionRuntime.isCorrect;
        let classToAdd,classToRemove;
        if(this.currentCard.isCorrect){
            classToAdd = this.options.classes.cardIsCorrect;
            classToRemove = this.options.classes.cardIsIncorrect;
        }else{
            classToAdd = this.options.classes.cardIsIncorrect;
            classToRemove = this.options.classes.cardIsCorrect;
        }
        this.currentCard.element.removeClass(classToRemove).addClass(classToAdd);
        this.element.triggerHandler(CardsQuizEvents.onQuestionChange,[<CardsQuizQuestionChangeEvent>{
            instance:this,
            card:this.currentCard,
            questionChange:{
                questionId:questionId,
                optionId:optionId,
                optionValue:optionValue
            }
        }]);
        
    }

    /**
     * Invoked when the quiz ends
     * @emits [[CardsQuizEvents.onEnd]]
     * @param e                 Event object
     * @param quizInstance      jqQuiz instance that emits the event
     * @param calification      The jqQuiz calification
     * @see [[https://davinchi-finsi.github.io/jq-quiz/calification]]
     * 
     */
    protected _onQuizEnd(e:Event,quizInstance:any,calification:any){
        this.quizInstance.disable();
        this.disable();
        this.element.triggerHandler(CardsQuizEvents.onEnd,[<CardsQuizEndEvent>{instance:this,calification:calification}])
    }

    /**
     * Invoked when a card is clicked
     * Activate the card clicked and the question related
     * @param e
     * 
     */
    protected _onCardClick(e:Event){
        if(!this.options.disabled && !this.isCardInTransition) {
            const target = $(e.currentTarget),
                question = target.attr(this.options.questionAttribute);
            this.activateCard(question);
            //activate card
        }
    }

    /**
     * Assign the events
     * 
     */
    protected _assignEvents(){
        this.cardsWrapper.off("."+this.options.namespace);
        this.quiz.off("."+this.options.namespace);
        this.cardsWrapper.on("flip:done."+this.options.namespace,this.options.selectors.card,this._onCardFlip.bind(this));
        this.cardsWrapper.on("click."+this.options.namespace,this.options.selectors.card,this._onCardClick.bind(this));
        //@ts-ignore
        this.quiz.on($.ui.jqQuiz.prototype.ON_OPTION_CHANGE+"."+this.options.namespace,this._onQuizChange.bind(this));
        //@ts-ignore
        this.quiz.on($.ui.jqQuiz.prototype.ON_END+"."+this.options.namespace,this._onQuizEnd.bind(this));
        //@ts-ignore
        this.quiz.on($.ui.jqQuiz.prototype.ON_QUESTION_SHOW+"."+this.options.namespace,this._onQuestionShown.bind(this));
    }
    protected _onQuestionShown(){
        this.isCardInTransition = false;
    }
    /**
     * Invoked when a card is flipped
     * @see http://nnattawat.github.io/flip/#events
     * @param e
     * 
     */
    protected _onCardFlip(e:Event){
        const target = $(e.currentTarget),
            questionIdOrIndex = target.attr(this.options.questionAttribute),
            card = this.cardsRegistry[questionIdOrIndex];
        if(card && card == this.currentCard){
            //@ts-ignore
            this.quizInstance.goTo(questionIdOrIndex);
        }
        this.element.triggerHandler(CardsQuizEvents.onCardFlip, [<CardsQuizCardFlipEvent>{instance: this, card: card}]);
        //this.isCardInTransition = false;
        //go to card for card
    }
    /**
     * Get all the values for data-* attributes
     * @param {JQuery} element          Element for which to get the the attributes
     * @param {string} prefix           Prefix to search. Usually represents the target of the parameters
     * @returns {{}}
     * @example Example:
     * ```html
     *  <div class="selector"
     *      data-dialog-disable="true"
     *      data-dialog-some-option="value"></div>
     * ```
     * ```javascript
     *  _getDataOptions($(".selector"),"dialog"); //{"disable":true,"someOption":"value"}
     * ```
     */
    protected _getDataOptions(element: JQuery, prefix: string) {
        //extract data-_attributes with jquery data
        let $element = $(element),
            params = $element.data(), parsedParams = {};
        //each param: data-prefix-my-param is prefixMyParam
        for (let key in params) {
            //find prefix
            if (key.search(prefix) !== -1) {
                //remove prefix: prefixMyParam to myParam
                let parsedKey: string = key.replace(prefix, "");
                //some components require different nomenclatures
                parsedKey = parsedKey.charAt(0).toLowerCase().concat(parsedKey.substring(1));
                let parsed = params[key];
                //try to parse to JSON
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                }
                parsedParams[parsedKey] = parsed;
            }
        }
        return parsedParams;
    }
}