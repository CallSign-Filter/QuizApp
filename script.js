//THIS IS ALL USING A MODULE PATTERN FOR PRIVACY MANAGEMENT

//*****************Data for quiz*****************
var quizController = (function() {

    //***QUESTION CONSTUCTOR*******
    function Question(id, questionText, options, correctAnswer) {
        this.id =id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var storedQuestions = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };

    if (storedQuestions.getQuestionCollection() === null) {
        storedQuestions.setQuestionCollection([]);
    }

    var quizProgress = {
        questionIndex: 0
    };

    //**************************PERSON CONSTRUCTOR*****************
    function Person(id, firstName, lastName, score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
    }

    var currentPersonData = {
        fullname: [],
        score: 0
    };

    var adminFullName = ['Brandon', 'Hessler'];

    var personLocalSotrage = {
        setPersonData: function(newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData))
        },
        getPersonData: function() {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function() {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalSotrage.getPersonData() === null) {
        personLocalSotrage.setPersonData([]);
    }



    //***********************************************************

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: storedQuestions,

        addQuestionOnLocalStorage: function(newQuestionText, options) {
            var optionsArr, correctAnswer, questionId, newQuestion, getStoredQuestions, isChecked;

            if (storedQuestions.getQuestionCollection() === null) {
                storedQuestions.setQuestionCollection([]);
            }

            optionsArr = [];

            for (var i = 0; i < options.length; i++) {
                if (options[i].value !== "") {
                    optionsArr.push(options[i].value);
                }

                if (options[i].previousElementSibling.checked && options[i].value !== "") {
                    correctAnswer = options[i].value;
                    isChecked = true;
                }
            }

            //make the questionId +1 from the last one in the storage;
            if (storedQuestions.getQuestionCollection().length > 0) {
                questionId = storedQuestions.getQuestionCollection()[storedQuestions.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }


            //INPUT VALIDATION
            if (newQuestionText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, correctAnswer);

                        getStoredQuestions = storedQuestions.getQuestionCollection();
                        getStoredQuestions.push(newQuestion);

                        storedQuestions.setQuestionCollection(getStoredQuestions);

                        //clear boxes and radio button
                        newQuestionText.value = "";
                        for (var j = 0; j < options.length; j++) {
                            options[j].value = "";
                            options[j].previousElementSibling.checked = false;
                        }
                        return true;
                    }else {
                        alert("You must check a correct answer, or you checked an answer without a value");
                        return false;
                    }
                } else {
                    alert('You must have at least two possible answers');
                    return false;
                }
            } else {
                alert("You must write a question");
                return false;
            }

        },

        checkAnswer: function(answer) {
            if (storedQuestions.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {
                return true;
            } else {
                return false;
            }
        },

        isFinished: function() {
            return quizProgress.questionIndex + 1 === storedQuestions.getQuestionCollection().length;
        },

        addPerson: function() {
            var newPerson, personId, personData;

            if(personLocalSotrage.getPersonData().length > 0) {
                personId = personLocalSotrage.getPersonData()[personLocalSotrage.getPersonData().length -1].id + 1
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);

            personData = personLocalSotrage.getPersonData();
            personData.push(newPerson);
            personLocalSotrage.setPersonData(personData);

            console.log(newPerson);
        },

        getCurrentPersonData: currentPersonData,

        getAdminFullName: adminFullName
    }

})();

//*****************UI CONTROLLER*****************
var UIController = (function() {

    var domItems ={

        //***********LANDING PAGE**********
        landingPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),

        //***** ADMIN PANEL ELEMENTS*******
        adminPanelContainer: document.querySelector('.admin-panel-container'),
        questionInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById('question-delete-btn'),
        questionsClearBtn: document.getElementById('questions-clear-btn'),

        //********Quiz section**************
        quizPageContainer: document.querySelector('.quiz-container'),
        askedQuestionText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressParagraph: document.getElementById('progress'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        instantAnswerContainer: document.querySelector(".instant-answer-container"),
        instantAnswerText: document.getElementById("instant-answer-text"),
        instantAnswerDiv: document.getElementById("instant-answer-wrapper"),
        instantIcon: document.getElementById("emotion"),

        //************FINAL RESULTS PAGE************
        resultsPageContainer: document.querySelector('.final-result-container')
    };

    return {
        getDomItems: domItems,

        //*****ADDS THE NEW OPTIONS BOX WHEN IT IS FOCUSED ON
        addInputsDynamically: function() {
            var addInput = function() {

                var inputHtml, counter;

                counter = document.querySelectorAll('.admin-option').length;
                inputHtml = '<div class="admin-option-wrapper">' +
                    '<input type="radio" class="admin-option-'+counter+'" name="answer" value="1">' +
                    '<input type="text" class="admin-option admin-option-'+counter+'" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHtml);

                domItems.adminOptionsContainer.lastElementChild.
                previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            };

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        //********CREATE QUESTION LIST

        createQuestionList: function(getQuestions) {

            var questionHTML;

            domItems.insertedQuestionsWrapper.innerHTML = "";

            for( var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                var question = getQuestions.getQuestionCollection()[i];
                questionHTML = '<p><span>'+ (question.id+1) +'. ' + question.questionText + '</span><button id="question-'+question.id+'">Edit</button></p>';

                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questionHTML);
            }

        },

        editQuestList: function(event, storageQuestList, addInputDynamicFcn, updateQuestionListFcn) {

            var getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestionList = storageQuestList.getQuestionCollection();

                for (var i = 0; i< getStorageQuestionList.length; i++) {
                    if (getStorageQuestionList[i].id === getId) {
                        foundItem = getStorageQuestionList[i];
                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;

                domItems.adminOptionsContainer.innerHTML = "";

                optionHTML = '';

                for (var j = 0; j < foundItem.options.length; j++) {
                    optionHTML += '<div class="admin-option-wrapper">' +
                        '<input type="radio" class="admin-option-'+j+'" name="answer" value="'+j+'">' +
                        '<input type="text" class="admin-option admin-option-'+j+'" value="'+foundItem.options[j]+'"></div>'
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questionsClearBtn.style.pointerEvents = 'none';

                addInputDynamicFcn();

                var toDefaultView = function() {

                    var updatedOptions = document.querySelectorAll(".admin-option");;

                    domItems.newQuestionText.value = '';
                    for (var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questionsClearBtn.style.pointerEvents = '';

                    updateQuestionListFcn(storageQuestList);
                };


                var updateQuestion = function () {
                    var newOptions, optionElements;

                    newOptions = [];
                    optionElements = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';

                    for (var i = 0; i < optionElements.length; i++) {
                        if (optionElements[i].value !== '') {
                            newOptions.push(optionElements[i].value);

                            if(optionElements[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionElements[i].value;
                            }
                        }
                    }

                    foundItem.options = newOptions;

                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== '') {

                                getStorageQuestionList.splice(placeInArr, 1, foundItem);

                                storageQuestList.setQuestionCollection(getStorageQuestionList);

                                toDefaultView()
                            } else {
                                alert("You must check a correct answer, or you checked an answer without a value");
                            }
                        }else {
                            alert('There must be at least two possible answers');
                        }
                    } else {
                        alert('The question cannot be blank');
                    }
                };

                domItems.questionUpdateBtn.onclick = updateQuestion;


                var deleteQuestion = function () {
                    getStorageQuestionList.splice(placeInArr, 1);

                    storageQuestList.setQuestionCollection(getStorageQuestionList);

                    toDefaultView();
                };

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }
        },
        clearQuestionList: function(storageQuestionList) {
            if (storageQuestionList.getQuestionCollection() === null) {
                storageQuestionList.setQuestionCollection([]);
            }
            if(storageQuestionList.getQuestionCollection().length > 0) {
                var conf = confirm('Are you sure you want to delete all of the questions?');
                if (conf) {
                    storageQuestionList.removeQuestionCollection();
                    domItems.insertedQuestionsWrapper.innerHTML = '';
                }
            }

        },

        displayQuestion: function(storageQuestionList, progress) {
            var newOptionHTML, charArr;

            charArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            if (storageQuestionList.getQuestionCollection !== null) {
                if (storageQuestionList.getQuestionCollection().length > 0) {
                    domItems.askedQuestionText.textContent =
                        storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;

                    domItems.quizOptionsWrapper.innerHTML = '';

                    var options = storageQuestionList.getQuestionCollection()[progress.questionIndex].options;
                    for (var i = 0; i < options.length; i++) {
                        newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + charArr[i] +'</span>' +
                            '<p  class="choice-' + i + '">' + options[i] + '</p></div>'

                        domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                    }
                }
            }

        },

        displayProgress: function(storageQuestionList, progress) {
            domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressParagraph.textContent = (progress.questionIndex +1) + "/" +
                storageQuestionList.getQuestionCollection().length
        },

        newDesign: function(answerResult, selectedAnswer) {

            var twoOptions;

            var index = answerResult ? 1 : 0;

            twoOptions = {
               instantAnswerText: ['Sorry you were incorrect', "That is correct"],
                instantAnswerClass: ['red', 'green'],
                emotionType: ['images/sad.png', "images/happy.png"],
                optionsBackground: ['rgba(200, 0, 0, 0.7)', "rgba(0, 250, 0, 0.3)"]
            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none";
            domItems.instantAnswerContainer.style.opacity = "1";

            domItems.instantAnswerText.textContent = twoOptions.instantAnswerText[index];

            domItems.instantAnswerDiv.className = twoOptions.instantAnswerClass[index];
            domItems.instantIcon.setAttribute('src', twoOptions.emotionType[index]);

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsBackground[index];
        },

         resetDesign: function() {
             domItems.quizOptionsWrapper.style.cssText = "";
             domItems.instantAnswerContainer.style.opacity = "0";
         },

        getFullName: function(currentPerson, storageQuestionList, admin) {
            currentPerson.fullname.push(domItems.firstNameInput.value);
            currentPerson.fullname.push(domItems.lastNameInput.value);

        }
    }


})();


//*****************Controls the two controllers********
var controller = (function(quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function() {

        var adminOptions = document.querySelectorAll('.admin-option');

        var addedSucessfully = quizController.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if (addedSucessfully) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }

    });

    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function(e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });

    selectedDomItems.questionsClearBtn.addEventListener('click', function() {
        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {

        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptionsDiv.length; i++) {
            if (e.target.className ==='choice-' + i) {
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var answerResult = quizCtrl.checkAnswer(answer);
                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestionBtn.textContent = 'Finish';
                }

                var nextQuestion = function(questionData, progress) {
                    if (quizCtrl.isFinished()) {
                        quizCtrl.addPerson();
                        console.log("done");
                    } else {
                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                };

                selectedDomItems.nextQuestionBtn.onclick = function() {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', function() {
        UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);


    })

})(quizController, UIController);