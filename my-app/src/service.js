import axios from 'axios';

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET

export const getToken = async (dispatch, code) => {
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
        dispatch({ type: 'GET_TOKEN', payload: { token: response.data.access_token } })
        // const octokit = new Octokit({
        //     auth: response.data.access_token
        //   })
        // const test = await octokit.request('GET /repos/yun-chiao/dcard-frontend-hw/issues', {
        //   owner: 'yun-chiao',
        //   repo: 'dcard-frontens-hw',
        //   headers: {
        //     'X-GitHub-Api-Version': '2022-11-28'
        //   }
        // })
        // console.log(test)
      } catch (error) {
        console.error(error);
      }
}