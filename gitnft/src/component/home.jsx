import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [totalContributions, setTotalContributions] = useState(null);

  const fetchGitHubData = async () => {
    setError('');
    setUserData(null);
    setTotalContributions(null);

    if (!username) {
      setError('Please enter a GitHub username'); 
      return;
    }

    try {
      const userResponse = await axios.get(`https://api.github.com/users/${username}`);
      setUserData(userResponse.data);

      const query = `
        query($userName:String!) {
          user(login: $userName){
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `;
      const variables = { userName: username };

      const contributionResponse = await axios.post(
        'https://api.github.com/graphql',
        { query, variables },
        {
          headers: {
            Authorization: `Bearer `,
          },
        }
      );
      const totalContributions =
        contributionResponse.data.data.user.contributionsCollection.contributionCalendar.totalContributions;
      setTotalContributions(totalContributions);
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">GitHub Contribution Checker</h1>
      <div className="w-full sm:max-w-md">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          className="w-full px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-md font-semibold"
          onClick={fetchGitHubData}
        >
          Search
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {userData && (
        <>
          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md w-full sm:max-w-lg">
            <div className="flex items-center">
              <img
                src={userData.avatar_url}
                alt={userData.login}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold">{userData.name}</h2>
                <p className="text-gray-400">@{userData.login}</p>
              </div>
            </div>
            <p className="mt-4">{userData.bio}</p>
            <div className="mt-4 flex justify-between">
              <div>
                <p className="font-semibold">Followers</p>
                <p>{userData.followers}</p>
              </div>
              <div>
                <p className="font-semibold">Following</p>
                <p>{userData.following}</p>
              </div>
              <div>
                <p className="font-semibold">Repositories</p>
                <p>{userData.public_repos}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md w-full sm:max-w-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Total Contributions</h2>
            <p className="text-5xl font-bold mb-4">{totalContributions}</p>
            <button
              className="py-2 px-4 bg-green-500 hover:bg-green-700 rounded-md font-semibold"
              onClick={() => alert(`You've claimed a reward for ${totalContributions} contributions!`)}
            >
              Claim Reward
            </button>
          </div>
        </>
      )}
    </div>
  );
}