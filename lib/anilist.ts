// This query is used to get my own list
// {
//   Page(perPage: 20, page: 1) {
//     activities(userId: 57505, type: MEDIA_LIST, sort: ID_DESC) {
//       ... on ListActivity {
//         media {
//           siteUrl
//           title {
//             userPreferred
//             english
//           }
//           coverImage {
//             color
//             large
//           }
//           isAdult
//         }
//         id
//         type
//         createdAt
//       }
//     }
//   }
// }

/**
 * Get id from username
 * @deprecated This is now done in Supabase
 */
export async function getUserId(username: string) {
  const userQuery = `
    {
      User(name: "${username}") {
        id
        name
      }
    }
    `;
  const url = 'https://graphql.anilist.co';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: userQuery,
    }),
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data.data.User.id;
}
