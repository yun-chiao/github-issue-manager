import axios from 'axios';
import { Octokit } from '@octokit/rest';

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET
const owner = "yun-chiao"
const repo = "dcard-frontend-hw"
let token = null;

export const getToken = async (navigate, code) => {
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
          client_id,
          client_secret,
          code
        }, {
          headers: {
            accept: 'application/json'
          }
        });
        token = response.data.access_token;
        navigate("/issues");
      } catch (error) {
        console.error(error);
      }
}

export const getIssues = async (dispatch, page) => {
    try {
        const octokit = new Octokit({
            auth: token
          })
        const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
          per_page: 10,
          page: page,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
        if(response.data.length === 0){
            dispatch({ type: 'NON_HAS_MORE' })
            return
        }else{
            dispatch({ type: 'HAS_MORE' })
        }
        if(page === 1){
            dispatch({ type: 'INIT_ISSUES', payload: { issues: response.data } })
        }else{
            dispatch({ type: 'UPDATE_ISSUES', payload: { issues: response.data } })
        }
    } catch (error) {
    console.error(error);
    }
}

export const closeIssue = async (dispatch, issue_number) => {
    try {
        const octokit = new Octokit({
            auth: token
          })
        const response = await octokit.request(`PATCH /repos/${owner}/${repo}/issues/${issue_number}`, {
            state: 'close',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        dispatch({ type: 'CLOSE_ISSUE', payload: { closed_number: issue_number } })
    } catch (error) {
    console.error(error);
    }
}

export const updateState = async (dispatch, issue_number, newState, labels) => {
  const states = ["Open", "Progressing", "Done"];

  let newLabels = [ {name: newState}, ...labels.filter( label => !states.includes(label.name))]

  try {
      const octokit = new Octokit({
          auth: token
        })

      await octokit.request(`PATCH /repos/${owner}/${repo}/issues/${issue_number}`, {
        owner,
        repo,
        issue_number,
        labels: newLabels,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      dispatch({type: 'UPDATE_STATE', payload: { issue_number, labels: newLabels } })
  } catch (error) {
  console.error(error);
  }
}