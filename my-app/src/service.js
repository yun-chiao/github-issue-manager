import axios from 'axios';
import { Octokit } from '@octokit/rest';

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET

export const getToken = async (code) => {
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
        return response.data.access_token;
      } catch (error) {
        console.error(error);
      }
}

export const getUser = async (token) => {
  try {
    const octokit = new Octokit({
      auth: token
    })
    
    const response = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return response.data.name
  } catch (error) {
    console.error(error);
  }
}

export const getRepos = async (token, owner) => {
  try {
    const octokit = new Octokit({
      auth: token
    })
    
    const response = await octokit.request(`GET /users/${owner}/repos`, {
      username: owner,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export const closeIssue = async (dispatch, issue_number, token, owner, repo) => {
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
        dispatch({ type: 'REMOVE_ISSUE', payload: { closed_number: issue_number } })
    } catch (error) {
    console.error(error);
    }
}

export const updateState = async (dispatch, issue_number, newState, labels, token, owner, repo, filterState) => {
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
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      // If the [newState] is in the [filterState] the users checked, the IssueCard would change label.
      // Otherwise, it would be removed from issue list
      // By this way, it doesn't to call api and bring the slower experience or feel the view refreshing to users.
      if(filterState[newState]){
        dispatch({type: 'UPDATE_STATE', payload: { issue_number, labels: newLabels } })
      }else{
        dispatch({ type: 'REMOVE_ISSUE', payload: { closed_number: issue_number } })
      }
  } catch (error) {
  console.error(error);
  }
}

export const createIssue = async (body, title, token, owner, repo) => {
  if(body.length < 30){
    console.log("要大於30字");
    return;
  }else if(title.length === 0){
    console.log("要有title");
    return;
  }
  try {
      const octokit = new Octokit({
          auth: token
        })

      const response = await octokit.request(`POST /repos/${owner}/${repo}/issues`, {
        owner,
        repo,
        title,
        body,
        labels:['Open'],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
  } catch (error) {
  console.error(error);
  }
}

export const UpdateIssue = async (dispatch, issue_number, body, title, token, owner, repo) => {
  if(body.length < 30){
    console.log("要大於30字");
    return;
  }else if(title.length === 0){
    console.log("要有title");
    return;
  }
  try {
      const octokit = new Octokit({
          auth: token
        })

      const response = await octokit.request(`PATCH /repos/${owner}/${repo}/issues/${issue_number}`, {
        owner,
        repo,
        issue_number,
        title,
        body,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
  } catch (error) {
  console.error(error);
  }
}

export const getIssue = async (issue_number, token, owner, repo) => {
  try {
      const octokit = new Octokit({
          auth: token
        })

      const response = await octokit.request(`GET /repos/${owner}/${repo}/issues/${issue_number}`, {
        owner: 'OWNER',
        repo: 'REPO',
        issue_number: 'ISSUE_NUMBER',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      return { title: response.data.title, body: response.data.body}
  } catch (error) {
  console.error(error);
  }
}

export const getIssues = async (dispatch, labels, orderState, searchKey, owner, repo, page) => {
  let per_page = 10
  let labelsList = Object.keys(labels).filter((key) => labels[key])
  try {
    const labelsQuery = labelsList.map((label) => label).join(',');
    const url = `https://api.github.com/search/issues?q=label:${labelsQuery}+sort:created-${orderState.order}+${searchKey} in:title,body+repo:${owner}/${repo}+type:issue&timestamp=${Date.now()}`;
    const config = {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      params: {
        per_page,
        page: page
      }
    };
    const response = await axios.get(url, config);
    if(response.data.items.length < per_page){
      dispatch({ type: 'NON_HAS_MORE' })
    }else{
      dispatch({ type: 'HAS_MORE' })
    }
    if(page === 1){
      dispatch({ type: 'INIT_ISSUES', payload: { issues: response.data.items } })
    }else{
      dispatch({ type: 'UPDATE_ISSUES', payload: { issues: response.data.items } })
    }
  } catch (error) {
    console.error(error);
  }
}