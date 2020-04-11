import { IonPage,IonContent,IonLabel, IonRadio, IonList, IonRadioGroup, IonItem, IonInput, IonTextarea, IonCheckbox, IonButton } from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import { authContext } from "../../contexts/AuthContext";
import StarRating from "../../components/StarRating"
import './Form.css'

var responses = {}
var survey_response = {}
var survey_data = {}
var survey_questions = {}
var responder_id = 0

// :TODO: Check if survey filled already. If yes, show that data.

const setQuestionResponse = (question_id, value) => {
    // :TODO: Response validaiton.
    let question = survey_questions[question_id]
    
    survey_response[question_id] = {
        responder_id: responder_id,
        survey_question_id: question_id,
        response: value
    }

    // If its a choice question, response is different.
    if(question.response_type === "choice") {
        survey_response[question_id].survey_choice_id = value
        survey_response[question_id].response = ""
    }
}

const SurveyForm = () => {
    const { surveyId } = useParams()
    const [survey, setSurvey] = React.useState({})
    const { getSurveyForm,setSurveyResponses } = React.useContext(dataContext)
    const { user } = React.useContext(authContext)

    React.useEffect(() => {
        async function fetchSurvey() {
            survey_data = await getSurveyForm(surveyId)
            if(survey_data) {
                setSurvey(survey_data)

                survey_data.questions.forEach(function flatten(q, i) {
                    if(q.type !== undefined && q.type === "category") { // If there are more questions inside a category...
                        q.questions.forEach(flatten) // add those recursivly
                    } else {
                        survey_questions[q.id] = q // Save all questions to a global array.
                    }
                })
                
                // Set responder id according to survey(student, volunteer, self, etc.)
                if(survey_data.responder === "User") {
                    const options = JSON.parse(survey_data.options)
                    if(options.responder_list === "self") {
                        responder_id = user.id // Current user is the responder.
                    }
                    // :TODO: Filling survey for other volunteers.
                }
                // :TODO: Student responder.
            } else {
                console.log("Error fetting survey form")
            }
        }
        fetchSurvey();
    }, [surveyId])

    const validateSurvey = () => {
        // :TODO: Impliment survey response validaiton.
        return true
    }

    const saveResponses = (e) => {
        e.preventDefault();
        if(validateSurvey()) {
            setSurveyResponses(survey.id, survey_response)
            // :TODO: If data exists already, overwrite.
        }
    }

    return (
        <IonPage>
            <Title name={ survey.template_name + ( survey.name ? " : " + survey.name : "" ) } />

            <IonContent>
                <form onSubmit={e => saveResponses(e)}>
                <QuestionsOrCategory questions={survey.questions} />

                <IonButton color="success" type="submit">Save</IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

const QuestionsOrCategory = ({ questions }) => {
    if(questions === undefined) return null

    return questions.map((ques, index ) => {
        if(ques.type === 'category') {
            return (
                <div className="category" key={index}>
                <IonItem className="category-name"><h3>{ ques.name }</h3></IonItem>
                <QuestionsOrCategory questions={ques.questions} />
                </div>
            )
        } else {
            return (<IonItem key={index}><Question {...ques} /></IonItem>)
        }
    })
}

const Question = ({ id, question, description, response_type, choices, options }) => {
    return (<div className="question-area" id={ "question-" + id }>
        <IonItem className="question" lines="none">
            <div>
            <div className="question-text">{ question }</div>
            { description ? <p className="question-description">{ description }</p> : null }
            </div>
        </IonItem>
        <IonItem><Response question_id={id} response_type={response_type} choices={choices} /></IonItem>
    </div>)
}

const Response = ({question_id, response_type, choices}) => {
    let render = null

    // :DEBUG: Prefill data
    responses = {
        9: "Matrix",
        10: "1997",
        11: 9,
        14: 5,
        15: "13/04/2000",
        12: true,
        13: 4
    }

    if(response_type === "choice") {
        // :TODO: Implement options.field_type == 'select'
        render = (<IonList><IonRadioGroup onIonChange={e => setQuestionResponse(question_id, e.detail.value)}>
            { choices.map((choice, index) => {
                return (
                    <IonItem key={index}>
                        <IonRadio value={choice.id} />
                        <IonLabel> &nbsp; { choice.name }</IonLabel>
                    </IonItem>
                )})
            }</IonRadioGroup></IonList>)

    } else if(response_type === "longtext") {
        render = (<IonTextarea value={responses[question_id]} onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)

    } else if(response_type === "text") {
        render = (<IonInput type="text" value={responses[question_id]} onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "1-5") {
        render = (<StarRating value={responses[question_id]} min="0" max="5" onChange={value => setQuestionResponse(question_id, value) } />)
    
    } else if(response_type === "1-10") {
        render = (<StarRating value={responses[question_id]} min="0" max="10" onChange={value => setQuestionResponse(question_id, value)} />)
    
    } else if(response_type === "date") {
        render = (<IonInput type="date" value={responses[question_id]} onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "yes-no") {
        render = (<IonCheckbox value={responses[question_id]} onIonChange={e => setQuestionResponse(question_id, e.target.checked)} />)
    
    } else if(response_type === "number") {
        render = (<IonInput type="number" value={responses[question_id]} onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    }

    // :TODO: multi-choice

    return render
}

export default SurveyForm;
