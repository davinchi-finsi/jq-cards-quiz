/**
 * @license jq-cards-quiz v1.0.2
 * (c) 2018 Finsi, Inc.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('flip')) :
    typeof define === 'function' && define.amd ? define(['exports', 'flip'], factory) :
    (factory((global.jqCardsQuiz = {})));
}(this, (function (exports) { 'use strict';

    /**
     * @module jqCardsQuiz
     */ /** */
    (function (CardsQuizEvents) {
        /**
         * Triggered when a card has been flipped
         * @see [[CardsQuizCardFlipEvent]]
         * @example ```
         * $("someSelector").on("cardsQuiz:cardFlip",(e,data)=>{console.log(data)});
         * ```
         */
        CardsQuizEvents["onCardFlip"] = "cardsQuiz:cardFlip";
        /**
         * Triggered when an option of a question changes
         * @see [[CardsQuizQuestionChangeEvent]]
         * @example ```
         * $("someSelector").on("cardsQuiz:questionChange",(e,data)=>{console.log(data});
         * ```
         */
        CardsQuizEvents["onQuestionChange"] = "cardsQuiz:questionChange";
        /**
         * Triggered when the quiz ends
         * @see [jqQuiz end event](https://davinchi-finsi.github.io/jq-quiz/events)
         * @see [[CardsQuizEndEvent]]
         * @example ```
         * $("someSelector").on("cardsQuiz:end",(e,data)=>{console.log(data});
         * ```
         */
        CardsQuizEvents["onEnd"] = "cardsQuiz:end";
    })(exports.CardsQuizEvents || (exports.CardsQuizEvents = {}));

    /**
     * Manage a card
     */
    var CardsQuizCardRegistry = /** @class */ (function () {
        function CardsQuizCardRegistry(params) {
            if (params === void 0) { params = {}; }
            /**
             * Ids of the answers for the question
             */
            this.answersIds = [];
            /**
             * Values of the answers for the question.
             * Could be undefined
             */
            this.answersValues = [];
            if (params.element != undefined) {
                this.element = params.element;
            }
            if (params.question != undefined) {
                this.question = params.question;
            }
            if (params.answersIds != undefined) {
                this.answersIds = params.answersIds;
            }
            if (params.answersValues != undefined) {
                this.answersValues = params.answersValues;
            }
            if (params.isCorrect != undefined) {
                this.isCorrect = params.isCorrect;
            }
            if (params.flipOptions != undefined) {
                this.flipOptions = params.flipOptions;
            }
            this.init();
        }
        /**
         * Turn the card
         */
        CardsQuizCardRegistry.prototype.flip = function () {
            this.instance.flip();
        };
        /**
         * Restore the card
         */
        CardsQuizCardRegistry.prototype.unflip = function () {
            this.instance.unflip();
        };
        /**
         * Detach the instance of the flip widget
         */
        CardsQuizCardRegistry.prototype.detachFlip = function () {
            this.element.off(".flip");
        };
        Object.defineProperty(CardsQuizCardRegistry.prototype, "isFlipped", {
            /**
             * True if the card is flipped, otherwise false
             * @returns {boolean}
             */
            get: function () {
                return this.instance.isFlipped;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initialize the widget
         */
        CardsQuizCardRegistry.prototype.init = function () {
            if (this.element) {
                this.detachFlip();
                //@ts-ignore
                this.element.flip(this.flipOptions);
                this.instance = this.element.data("flipModel");
            }
        };
        return CardsQuizCardRegistry;
    }());

    /**
     * @module jqCardsQuiz
     */
    /**
     * Cards quiz game
     */
    var CardsQuizGame = /** @class */ (function () {
        function CardsQuizGame() {
        }
        /**
         * Disable the widget
         */
        CardsQuizGame.prototype.disable = function () {
            //@ts-ignore
            this._super();
            this.element.addClass(this.options.classes.disabled);
            this.quizInstance.disable();
        };
        /**
         * Enable the widget
         */
        CardsQuizGame.prototype.enable = function () {
            //@ts-ignore
            this._super();
            this.element.removeClass(this.options.classes.disabled);
            this.quizInstance.enable();
        };
        /**
         * Activate a card by the question id or question index
         * @param questionIdOrIndex     Id or index of the question to activate. If null, the current card will be deactivated
         */
        CardsQuizGame.prototype.activateCard = function (questionIdOrIndex) {
            if (!this.options.disabled && !this.isCardInTransition) {
                if (questionIdOrIndex != undefined) {
                    var card = this.cardsRegistry[questionIdOrIndex];
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
                            }
                            else {
                                this.quizInstance.goTo(questionIdOrIndex);
                            }
                        }
                        else {
                            this.isCardInTransition = false;
                        }
                    }
                }
                else {
                    if (this.currentCard) {
                        this.isCardInTransition = true;
                        this.quizInstance.goTo(null);
                        this.currentCard.element.removeClass(this.options.classes.cardActive);
                        this.currentCard.unflip();
                    }
                }
            }
        };
        /**
         * JQuery ui function to get the default options
         *
         */
        CardsQuizGame.prototype._getCreateOptions = function () {
            var options = {
                namespace: "jq-cards-quiz",
                questionAttribute: "data-cq-question",
                classes: {
                    root: "c-cards-quiz",
                    disabled: "c-cards-quiz--disabled",
                    quiz: "c-cards-quiz__quiz",
                    cardsWrapper: "c-cards-quiz__cards",
                    card: "c-cards-quiz__card",
                    cardIsCorrect: "c-cards-quiz__card--correct",
                    cardIsIncorrect: "c-cards-quiz__card--incorrect",
                    cardActive: "c-cards-quiz__card--active"
                },
                selectors: {
                    cardsWrapper: "[data-cq-cards]",
                    card: "[data-cq-card]",
                    quiz: "[data-cq-quiz]"
                },
                flip: {},
                jqQuiz: {}
            };
            return options;
        };
        /**
         * JQuery ui widget constructor
         * @constructor
         *
         */
        CardsQuizGame.prototype._create = function () {
            this.element.addClass(this.options.classes.root);
            //force flip to manual to manage the disable state
            this._init();
            this._assignEvents();
        };
        /**
         * Initialize the widget
         *
         */
        CardsQuizGame.prototype._init = function () {
            //inspect the dom
            //get cards wrapper
            this.cardsWrapper = this.element.find(this.options.selectors.cardsWrapper).addClass(this.options.classes.cardsWrapper);
            //get cards
            this.cards = this.cardsWrapper.find(this.options.selectors.card).addClass(this.options.classes.card);
            //get quiz
            this.quiz = this.element.find(this.options.selectors.quiz).addClass(this.options.classes.quiz);
            //instantiate quiz
            //force some options in the quiz
            var quizOptions = $.extend(true, {}, this.options.jqQuiz, { autoStart: true, initialQuestion: null, autoGoNext: false });
            //@ts-ignore
            this.quiz.jqQuiz(quizOptions);
            //@ts-ignore
            this.quizInstance = this.quiz.jqQuiz("instance");
            this.cardsRegistry = {};
            //instantiate cards
            for (var cardIndex = 0, cardsLength = this.cards.length; cardIndex < cardsLength; cardIndex++) {
                var currentCard = this.cards.eq(cardIndex), question = currentCard.attr(this.options.questionAttribute);
                if (question != undefined) {
                    var flipOptions = this._getDataOptions(currentCard, "flip"), registry = void 0;
                    flipOptions = Object.keys(this._getDataOptions(currentCard, "flip")).length > 0 ? flipOptions : this.options.flip;
                    flipOptions.trigger = "manual";
                    registry = new CardsQuizCardRegistry({
                        element: currentCard,
                        question: question,
                        flipOptions: flipOptions
                    });
                    this.cardsRegistry[question] = registry;
                }
                else {
                    throw "[CardsQuizGame] The card must have a question";
                }
            }
        };
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
        CardsQuizGame.prototype._onQuizChange = function (e, quizInstance, questionId, optionId, optionValue, questionRuntime) {
            this.currentCard.answersIds = questionRuntime.options;
            this.currentCard.answersValues = questionRuntime.optionsValues;
            this.currentCard.isCorrect = questionRuntime.isCorrect;
            var classToAdd, classToRemove;
            if (this.currentCard.isCorrect) {
                classToAdd = this.options.classes.cardIsCorrect;
                classToRemove = this.options.classes.cardIsIncorrect;
            }
            else {
                classToAdd = this.options.classes.cardIsIncorrect;
                classToRemove = this.options.classes.cardIsCorrect;
            }
            this.currentCard.element.removeClass(classToRemove).addClass(classToAdd);
            this.element.triggerHandler(exports.CardsQuizEvents.onQuestionChange, [{
                    instance: this,
                    card: this.currentCard,
                    questionChange: {
                        questionId: questionId,
                        optionId: optionId,
                        optionValue: optionValue
                    }
                }]);
        };
        /**
         * Invoked when the quiz ends
         * @emits [[CardsQuizEvents.onEnd]]
         * @param e                 Event object
         * @param quizInstance      jqQuiz instance that emits the event
         * @param calification      The jqQuiz calification
         * @see [[https://davinchi-finsi.github.io/jq-quiz/calification]]
         *
         */
        CardsQuizGame.prototype._onQuizEnd = function (e, quizInstance, calification) {
            this.quizInstance.disable();
            this.disable();
            this.element.triggerHandler(exports.CardsQuizEvents.onEnd, [{ instance: this, calification: calification }]);
        };
        /**
         * Invoked when a card is clicked
         * Activate the card clicked and the question related
         * @param e
         *
         */
        CardsQuizGame.prototype._onCardClick = function (e) {
            if (!this.options.disabled && !this.isCardInTransition) {
                var target = $(e.currentTarget), question = target.attr(this.options.questionAttribute);
                this.activateCard(question);
                //activate card
            }
        };
        /**
         * Assign the events
         *
         */
        CardsQuizGame.prototype._assignEvents = function () {
            this.cardsWrapper.off("." + this.options.namespace);
            this.quiz.off("." + this.options.namespace);
            this.cardsWrapper.on("flip:done." + this.options.namespace, this.options.selectors.card, this._onCardFlip.bind(this));
            this.cardsWrapper.on("click." + this.options.namespace, this.options.selectors.card, this._onCardClick.bind(this));
            //@ts-ignore
            this.quiz.on($.ui.jqQuiz.prototype.ON_OPTION_CHANGE + "." + this.options.namespace, this._onQuizChange.bind(this));
            //@ts-ignore
            this.quiz.on($.ui.jqQuiz.prototype.ON_END + "." + this.options.namespace, this._onQuizEnd.bind(this));
            //@ts-ignore
            this.quiz.on($.ui.jqQuiz.prototype.ON_QUESTION_SHOW + "." + this.options.namespace, this._onQuestionShown.bind(this));
        };
        CardsQuizGame.prototype._onQuestionShown = function () {
            this.isCardInTransition = false;
        };
        /**
         * Invoked when a card is flipped
         * @see http://nnattawat.github.io/flip/#events
         * @param e
         *
         */
        CardsQuizGame.prototype._onCardFlip = function (e) {
            var target = $(e.currentTarget), questionIdOrIndex = target.attr(this.options.questionAttribute), card = this.cardsRegistry[questionIdOrIndex];
            if (card && card == this.currentCard) {
                //@ts-ignore
                this.quizInstance.goTo(questionIdOrIndex);
            }
            this.element.triggerHandler(exports.CardsQuizEvents.onCardFlip, [{ instance: this, card: card }]);
            //this.isCardInTransition = false;
            //go to card for card
        };
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
        CardsQuizGame.prototype._getDataOptions = function (element, prefix) {
            //extract data-_attributes with jquery data
            var $element = $(element), params = $element.data(), parsedParams = {};
            //each param: data-prefix-my-param is prefixMyParam
            for (var key in params) {
                //find prefix
                if (key.search(prefix) !== -1) {
                    //remove prefix: prefixMyParam to myParam
                    var parsedKey = key.replace(prefix, "");
                    //some components require different nomenclatures
                    parsedKey = parsedKey.charAt(0).toLowerCase().concat(parsedKey.substring(1));
                    var parsed = params[key];
                    //try to parse to JSON
                    try {
                        parsed = JSON.parse(parsed);
                    }
                    catch (e) {
                    }
                    parsedParams[parsedKey] = parsed;
                }
            }
            return parsedParams;
        };
        return CardsQuizGame;
    }());

    /**
     * @module jqCardsQuiz
     */ /** */
    //$.widget extends the prototype that receives, to extend the prototype all the properties must be enumerable
    //the properties of a es6 class prototype aren't enumerable so it's necessary to get the propertyNames and get the descriptor of each one
    if (Object.hasOwnProperty("getOwnPropertyDescriptors")) {
        //@ts-ignore
        var proto = {}, names = Object.getOwnPropertyNames(CardsQuizGame.prototype);
        for (var nameIndex = 0, namesLength = names.length; nameIndex < namesLength; nameIndex++) {
            var currentName = names[nameIndex];
            proto[currentName] = Object.getOwnPropertyDescriptor(CardsQuizGame.prototype, currentName).value;
        }
        $.widget("ui.cardsQuiz", proto);
    }
    else {
        $.widget("ui.cardsQuiz", CardsQuizGame.prototype);
    }

    /**
     * @module jqCardsQuiz
     * @preferred
     */ /** */

    exports.CardsQuizCardRegistry = CardsQuizCardRegistry;
    exports.CardsQuizGame = CardsQuizGame;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
