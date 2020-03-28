import { IonPage,IonContent,IonLabel, IonRadio, IonList, IonRadioGroup, IonItem, IonInput, IonTextarea, IonCheckbox, IonButton } from '@ionic/react';
import React from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"
import StarRating from "../../components/StarRating"
import './Form.css'

var responses = {}
const setQuestionResponse = (question_id, value) => {
    responses[question_id] = value

    console.log(question_id, value, responses)
}

const SurveyForm = () => {
    const { surveyId } = useParams()
    const [survey, setSurvey] = React.useState({})
    const { getSurveyForm } = React.useContext(dataContext)

    React.useEffect(() => {
        async function fetchSurvey() {
            let survey_data = await getSurveyForm(surveyId)
            if(survey_data) setSurvey(survey_data)
            else {
                console.log("Error fetting survey form")
            }
        }
        fetchSurvey();
    }, [surveyId])

    const validateSurvey = () => {
        // :TODO: Impliment this.
        return true
    }

    const saveResponses = (e) => {
        e.preventDefault();
        if(validateSurvey()) {
            // :TODO: Save the from using API
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
    render = (<StarRating min="0" max="5" value="3" onChange={value => {console.log("Value", value); /* setQuestionResponse(question_id, value) */}} />)
    
    } else if(response_type === "1-10") {
        render = (<StarRating min="0" max="10" value="3" onChange={value => setQuestionResponse(question_id, value)} />)
    
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
