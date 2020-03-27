import { IonPage,IonContent,IonLabel, IonRadio, IonList, IonRadioGroup, IonItem, IonInput, IonTextarea, IonCheckbox } from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import api from "../../utils/API"
import StarRating from "../../components/StarRating"
import './Form.css'

var responses = {}
const setQuestionResponse = (question_id, value) => {
    responses[question_id] = value

    // console.log(responses)
}

const SurveyForm = () => {
    const { surveyId } = useParams()
    const [survey, setSurvey] = React.useState({})
    const { setLoading } = React.useContext(appContext)
    const { user } = React.useContext(authContext)

    React.useEffect(() => {
        async function fetchSurvey() {
            setLoading(true)
            const survey_response = await api.rest(`surveys/${surveyId}`)

            if(survey_response.surveys !== undefined) {
                let survey = survey_response.surveys
                setSurvey(survey)
                const questions_response = await api.rest(`survey_templates/${survey.survey_template_id}/categorized_questions`)

                if(questions_response.questions !== undefined) {
                    survey['questions'] = questions_response.questions
                    setSurvey(survey)
                } else {
                    console.error("survey questions fetch call failed.")
                }

            } else {
                console.error("survey fetch call failed.")
            }
            setLoading(false)
        }
        fetchSurvey();
    }, [surveyId])

    return (
        <IonPage>
            <Title name={ survey.template_name + ( survey.name ? " : " + survey.name : "" ) } />

            <IonContent>
                <QuestionsOrCategory questions={survey.questions} />

            </IonContent>
        </IonPage>
    );
};

const QuestionsOrCategory = ({ questions }) => {
    if(questions === undefined) return null

    return questions.map((ques, index ) => {
        if(ques.type === 'category') {
            return (
                <>
                <IonItem className="category" key={index}><h3>{ ques.name }</h3></IonItem>
                <QuestionsOrCategory questions={ques.questions} />
                </>
            )
        } else {
            return (<IonItem key={index}><Question {...ques} /></IonItem>)
        }
    })
}

const Question = ({ id, question, description, response_type, choices, options }) => {
    return (<div className="question-area" id={ "question-" + id }>
        <IonItem className="question">
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
        render = (<IonTextarea onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)

    } else if(response_type === "text") {
        render = (<IonInput type="text" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "1-5") {
        /**
         * if(label) html += `<span class="rating-label rating-label-begin">${label}</span>`;
			html += `<input ${attributes} class="response rating rating-loading" data-min="0" data-max="5" data-stars="5" data-step="1" />`;
			label = this.getOption(q, 'label_5');
			if(label) html += `<span class="rating-label rating-label-end">${label}</span>`;
         */
        render = (<StarRating min="0" max="5" value="3" onChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "1-10") {
        render = (<StarRating min="0" max="10" value="3" onChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "date") {
        render = (<IonInput type="date" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    } else if(response_type === "yes-no") {
        render = (<IonCheckbox onIonChange={e => setQuestionResponse(question_id, e.target.checked)} />)
    
    } else if(response_type === "number") {
        render = (<IonInput type="number" onIonChange={e => setQuestionResponse(question_id, e.target.value)} />)
    
    }

    // :TODO: multi-choice

    return render
}

export default SurveyForm;
