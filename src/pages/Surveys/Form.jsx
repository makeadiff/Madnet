import {
  IonPage,
  IonContent,
  IonLabel,
  IonRadio,
  IonList,
  IonRadioGroup,
  IonItem,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent
} from '@ionic/react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import Title from '../../components/Title'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import { authContext } from '../../contexts/AuthContext'
import StarRating from '../../components/StarRating'
import Paginator from '../../components/Paginator'
import './Form.css'

var survey_response = {}
var survey_data = {}
var survey_questions = {}
var responder_id = 0

const setQuestionResponse = (question_id, value) => {
  const question = survey_questions[question_id]

  survey_response[question_id] = {
    responder_id: responder_id,
    survey_question_id: question_id,
    response: value
  }

  // If its a choice question, response is different.
  if (question.response_type === 'choice') {
    survey_response[question_id].survey_choice_id = value
    survey_response[question_id].response = ''
  }
}

const SurveyForm = () => {
  const { surveyId } = useParams()
  const [survey, setSurvey] = React.useState({})
  const [responses, setResponses] = React.useState({})
  const { getSurveyForm, setSurveyResponses, callApi } = React.useContext(
    dataContext
  )
  const { user } = React.useContext(authContext)
  const { showMessage } = React.useContext(appContext)

  React.useEffect(() => {
    async function getSurveyResponse(responder_id) {
      const existing_survey_response = await callApi({
        url: `/surveys/${surveyId}/responses?responder_id=${responder_id}`
      })
      let existing_responses = {}
      for (let i in existing_survey_response) {
        let ele = existing_survey_response[i]
        const question = survey_questions[ele.survey_question_id]
        let response = ele.response
        if (question.response_type === 'choice') {
          response = ele.survey_choice_id
        }
        existing_responses[question.id] = response
      }
      setResponses(existing_responses)
    }

    async function fetchSurvey() {
      survey_data = await getSurveyForm(surveyId)
      if (survey_data) {
        survey_data.questions.forEach(function flatten(q, i) {
          if (q.type !== undefined && q.type === 'category') {
            // If there are more questions inside a category...
            q.questions.forEach(flatten) // add those recursivly
          } else {
            survey_questions[q.id] = q // Save all questions to a global array.
            survey_response[q.id] = {
              response: '',
              survey_choice_id: 0
            }
          }
        })
        setSurvey(survey_data)

        // Set responder id according to survey(student, volunteer, self, etc.)
        if (survey_data.responder === 'User') {
          const options = JSON.parse(survey_data.options)
          if (options.responder_list === 'self') {
            responder_id = user.id // Current user is the responder.
            getSurveyResponse(responder_id)
          }
          // :TODO: Filling survey for other volunteers.
        }
        // :TODO: Student responder.
      } else {
        console.log('Error fetching survey form')
      }
    }
    fetchSurvey()
  }, [surveyId])

  const validateSurvey = () => {
    // This function is not actually needed. Responses has the 'requried' html5 attribute.
    let valid = true
    console.log('Validating', survey_questions)
    for (let i in survey_questions) {
      let q = survey_questions[i]
      if (q.required === '1' && survey_response[q.id].response === '') {
        console.log('No data in ', q)
        valid = false
        break
      }
    }
    return true // :DEBUG: :TODO:
  }

  const saveResponses = async (e) => {
    // console.log("Submitted")
    e.preventDefault()
    if (validateSurvey()) {
      const saved = await setSurveyResponses(survey.id, survey_response)
      if (saved) showMessage('Saved survey response successfully')
      else
        showMessage('Error saving Survey response! Please try again.', 'error')
      // :TODO: If data exists already, overwrite.
    }
  }

  return (
    <IonPage>
      <Title
        name={survey.template_name + (survey.name ? ' : ' + survey.name : '')}
      />

      <IonContent className="dark">
        {survey.description ? (
          <IonCard className="dark no-shadow">
            <IonCardContent>
              <div
                dangerouslySetInnerHTML={{ __html: survey.description }}
              ></div>
            </IonCardContent>
          </IonCard>
        ) : null}

        <form onSubmit={(e) => saveResponses(e)}>
          <QuestionsOrCategory
            questions={survey.questions}
            responses={responses}
            options={
              survey.options
                ? JSON.parse(survey.options)
                : { responder_list: null, paginate: null }
            }
          />

          {Object.keys(responses).length ? null : ( // Don't show submit button if we have existing responses.
            <IonButton className="action-button" type="submit">
              Save
            </IonButton>
          )}
        </form>
      </IonContent>
    </IonPage>
  )
}

const QuestionsOrCategory = ({ questions, responses, options }) => {
  const [page, setPage] = React.useState(1)
  if (questions === undefined) return null

  let category = questions[page - 1]

  const moveToPage = (current_page) => {
    setPage(current_page)
    category = questions[current_page - 1]
  }

  // :TODO: :NEXT: Rework this.

  if (
    options &&
    options.paginate === 'category' &&
    questions[page - 1].type === 'category'
  ) {
    console.log(options, questions, responses)
    const url = document.location.href
    const pagination = {
      current_page: page,
      last_page: questions.length,
      first_page_url: url + '?page=1',
      last_page_url: url + '?page=' + (questions.length + 1),
      next_page_url:
        page + 1 <= questions.length ? url + '?page=' + (page + 1) : null,
      prev_page_url: page - 1 > 0 ? url + '?page=' + (page - 1) : null,
      data: category
    }
    console.log(pagination)
    return (
      <div className="category">
        <div className="category-name">
          <h3>{category.name}</h3>
        </div>
        <Paginator data={pagination} pageHandler={moveToPage}></Paginator>

        <QuestionsOrCategory
          questions={category.questions}
          responses={responses}
        />
      </div>
    )
  }

  return questions.map((ques, index) => {
    if (ques.type === 'category') {
      return (
        <div className="category" key={index}>
          <div className="category-name">
            <h3>{ques.name}</h3>
          </div>
          <QuestionsOrCategory
            questions={ques.questions}
            responses={responses}
          />
        </div>
      )
    } else {
      let response = ''
      if (responses !== undefined) response = responses[ques.id]
      return <Question key={index} {...ques} response={response} />
    }
  })
}

const Question = ({
  id,
  question,
  description,
  required,
  response_type,
  choices,
  response,
  options
}) => {
  let req = required === '1' ? true : false

  return (
    <div className="question-area" id={'question-' + id}>
      <IonCard className="dark no-shadow">
        <IonCardHeader>
          <p className="question-text">
            {question}{' '}
            {required === '1' ? <span className="required">*</span> : null}
          </p>
          {description ? (
            <p className="question-description">{description}</p>
          ) : null}
        </IonCardHeader>
        <IonCardContent>
          <Response
            question_id={id}
            response_type={response_type}
            choices={choices}
            response={response}
            required={req}
          />
        </IonCardContent>
      </IonCard>
    </div>
  )
}

const Response = ({
  question_id,
  response,
  required,
  response_type,
  choices
}) => {
  setQuestionResponse(question_id, response)

  if (response_type === 'choice') {
    // :TODO: Implement options.field_type == 'select'
    return (
      <IonList>
        <IonRadioGroup
          value={response}
          required={required}
          onIonChange={(e) => setQuestionResponse(question_id, e.detail.value)}
        >
          {choices.map((choice, index) => {
            return (
              <IonItem key={index}>
                <IonRadio value={choice.id} />
                <IonLabel> &nbsp; {choice.name}</IonLabel>
              </IonItem>
            )
          })}
        </IonRadioGroup>
      </IonList>
    )
  } else if (response_type === 'longtext') {
    return (
      <IonTextarea
        value={response}
        required={required}
        onIonChange={(e) => setQuestionResponse(question_id, e.target.value)}
      />
    )
  } else if (response_type === 'text') {
    return (
      <IonInput
        value={response}
        type="text"
        required={required}
        onIonChange={(e) => setQuestionResponse(question_id, e.target.value)}
      />
    )
  } else if (response_type === '1-5') {
    return (
      <StarRating
        value={response}
        min="0"
        max="5"
        onChange={(value) => setQuestionResponse(question_id, value)}
      />
    )
  } else if (response_type === '1-10') {
    return (
      <StarRating
        value={response}
        min="0"
        max="10"
        onChange={(value) => setQuestionResponse(question_id, value)}
      />
    )
  } else if (response_type === 'date') {
    return (
      <IonInput
        value={response}
        type="date"
        required={required}
        onIonChange={(e) => setQuestionResponse(question_id, e.target.value)}
      />
    )
  } else if (response_type === 'yes-no') {
    return (
      <IonCheckbox
        checked={response ? true : false}
        onIonChange={(e) => setQuestionResponse(question_id, e.target.checked)}
      />
    )
  } else if (response_type === 'number') {
    return (
      <IonInput
        value={response}
        type="number"
        required={required}
        onIonChange={(e) => setQuestionResponse(question_id, e.target.value)}
      />
    )
  }
  // :TODO: multi-choice

  return null
}

export default SurveyForm
