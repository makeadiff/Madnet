import { IonPage,IonContent,IonLabel, IonRadio, IonList, IonRadioGroup, IonItem, IonInput, IonTextarea, IonCheckbox, IonButton } from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import { authContext } from "../../contexts/AuthContext";
import StarRating from "../../components/StarRating"
import './Form.css'

var survey_response = {}
var survey_data = {}
var survey_questions = {}
var responder_id = 0

// :TODO: Check if survey filled already. If yes, show that data.

const setQuestionResponse = (question_id, value) => {
    // :TODO: Response validaiton.
    const question = survey_questions[question_id]
    
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
    const [responses, setResponses] = React.useState({})
    const { getSurveyForm,setSurveyResponses,callApi } = React.useContext(dataContext)
    const { user } = React.useContext(authContext)

    React.useEffect(() => {
        async function getSurveyResponse(responder_id) {
            const existing_survey_response = await callApi({ url: `/surveys/${surveyId}/responses?responder_id=${responder_id}`})
            let existing_responses = {}
            for(let i in existing_survey_response) {
                let ele = existing_survey_response[i]
                const question = survey_questions[ele.survey_question_id]
                let response = ele.response
                if(question.response_type === "choice") {
                    response = ele.survey_choice_id
                }
                existing_responses[question.id] = response
            }
            setResponses(existing_responses)
        }

        async function fetchSurvey() {
            survey_data = await getSurveyForm(surveyId)
            if(survey_data) {
                survey_data.questions.forEach(function flatten(q, i) {
                    if(q.type !== undefined && q.type === "category") { // If there are more questions inside a category...
                        q.questions.forEach(flatten) // add those recursivly
                    } else {
                        survey_questions[q.id] = q // Save all questions to a global array.
                        survey_response[q.id] = {
                            response: "",
                            survey_choice_id: 0
                        }
                    }
                })
                setSurvey(survey_data)
                
                // Set responder id according to survey(student, volunteer, self, etc.)
                if(survey_data.responder === "User") {
                    const options = JSON.parse(survey_data.options)
                    if(options.responder_list === "self") {
                        responder_id = user.id // Current user is the responder.
                        getSurveyResponse(responder_id)
                    }
                    // :TODO: Filling survey for other volunteers.
                }
                // :TODO: Student responder.
            } else {
                console.log("Error fetching survey form")
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
                <QuestionsOrCategory questions={survey.questions} responses={responses} />

                <IonButton color="success" type="submit">Save</IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

const QuestionsOrCategory = ({ questions, responses }) => {
    if(questions === undefined) return null

    return questions.map((ques, index ) => {
        if(ques.type === 'category') {
            return (
                <div className="category" key={index}>
                <IonItem className="category-name"><h3>{ ques.name }</h3></IonItem>
                <QuestionsOrCategory questions={ques.questions} responses={responses} />
                </div>
            )
        } else {
            let response = ""
            if(responses !== undefined) response = responses[ques.id]
            return (<IonItem key={index}><Question {...ques} response={response} /></IonItem>)
        }
    })
}

const Question = ({ id, question, description, response_type, choices, response, options }) => {
    return (<div className="question-area" id={ "question-" + id }>
        <IonItem className="question" lines="none">
            <div>
            <div className="question-text">{ question }</div>
            { description ? <p className="question-description">{ description } ({id} : { response })</p> : null }
            </div>
        </IonItem>
        <IonItem><Response question_id={id} response_type={response_type} choices={choices} response={response} /></IonItem>
    </div>)
}

const Response = ({question_id, response, response_type, choices}) => {
    if(response_type === "choice") {
        // :TODO: Implement options.field_type == 'select'
        return (<IonList><IonRadioGroup onIonChange={e => setQuestionResponse(question_id, e.detail.value)}>
            { choices.map((choice, index) => {
                return (
                    <IonItem key={ index }>
                        <IonRadio value={ choice.id } />
                        <IonLabel> &nbsp; { choice.name }</IonLabel>
                    </IonItem>
                )})
            }</IonRadioGroup></IonList>)

    } else if(response_type === "longtext") {
        return (<IonTextarea value={ response } onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)

    } else if(response_type === "text") {
        return (<IonInput value={ response } type="text" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "1-5") {
        return (<StarRating value={ response } min="0" max="5" onChange={value => setQuestionResponse(question_id, value) } />)
    
    } else if(response_type === "1-10") {
        console.log(response)
        return (<StarRating value={ response } min="0" max="10" onChange={value => setQuestionResponse(question_id, value)} />)
    
    } else if(response_type === "date") {
        return (<IonInput value={ response } type="date" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "yes-no") {
        return (<IonCheckbox checked={ response ? true : false } onIonChange={e => setQuestionResponse(question_id, e.target.checked)} />)
    
    } else if(response_type === "number") {
        return (<IonInput value={ response } type="number" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    }
        // :TODO: multi-choice

    return null
}

export default SurveyForm;
