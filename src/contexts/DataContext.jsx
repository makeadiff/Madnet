import * as React from "react";
import { appContext } from "./AppContext"
import { authContext } from "./AuthContext";
import api from "../utils/API"

// This is the global store. Just didn't want to call it a store because I'm not sure if this is how to implement it.

export const dataContext = React.createContext({
    getSurveyForm: () => {},
    setSurveyResponses: () => {}
});

const { Provider } = dataContext;

const DataProvider = ({ children }) => {
    const { getSurveyForm,setSurveyResponses } = useHandler();

    return (
        <Provider value={{ getSurveyForm,setSurveyResponses }}>
            {children}
        </Provider>
    );
};

const useHandler = () => {
    const { setLoading } = React.useContext(appContext)
    const [error, setError] = React.useState([]);
    const { user } = React.useContext(authContext);

    const getSurveyForm = async (surveyId) => {
        setLoading(true)
        const survey_response = await api.rest(`surveys/${surveyId}`)

        if (survey_response.surveys !== undefined) {
            let survey = survey_response.surveys
            const questions_response = await api.rest(`survey_templates/${survey.survey_template_id}/categorized_questions`)

            if (questions_response.questions !== undefined) {
                survey['questions'] = questions_response.questions
                setLoading(false)
                return survey
            } else {
                setError({
                    "status": "warning",
                    "message": "Survey Questions fetch call failed",
                    "endpoint": `survey_templates/${survey.survey_template_id}/categorized_questions`
                })
                setLoading(false)
                return survey
            }
        } else {
            setError({
                "status": "error",
                "message": "Survey fetch call failed",
                "endpoint": `surveys/${surveyId}`
            })
        }
        setLoading(false)
        return false
    }

    const setSurveyResponses = async (surveyId, responderId, responses) => {
        if(!responderId) responderId = user.id
        setLoading(true)

        let survey_response = []
        console.log(responses)

        // :TODO: Choices not working, check date as well.
        for(let question_id in responses) {
            survey_response.push({
                responder_id: responderId,
                survey_question_id: question_id,
                response: responses[question_id]
            })
        }
        const call_response = await api.rest(`surveys/${surveyId}/responses`, 'post', survey_response)
        setLoading(false)

        if(call_response) return true
        return false
    }


    return {
        getSurveyForm, setSurveyResponses
    };
};

export default DataProvider;
