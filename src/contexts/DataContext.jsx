import * as React from "react";
import { appContext } from "./AppContext"
import api from "../utils/API"

// This is the global store. Just didn't want to call it a store because I'm not sure if this is how to implement it.

export const dataContext = React.createContext({
    getSurveyForm: () => { }
});

const { Provider } = dataContext;

const DataProvider = ({ children }) => {
    const { getSurveyForm } = useHandler();

    return (
        <Provider value={{ getSurveyForm }}>
            {children}
        </Provider>
    );
};

const useHandler = () => {
    const { setLoading } = React.useContext(appContext)
    const [error, setError] = React.useState([]);

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


    return {
        getSurveyForm
    };
};

export default DataProvider;
