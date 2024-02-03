import { useRouter } from 'vue-router'

import AppApiService from '../../service/index'

export function Actions() {
  const service = AppApiService()
  const router = useRouter()

  // upvote a submission
  const upvote = async (itemId) => {
    try {
      const response = await service.upvoteSubmission(itemId)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  // downvote a submission
  const downvote = async (itemId) => {
    try {
      await service.downvoteSubmission(itemId)
    } catch (error) {
      console.error(error)
    }
  }

  // Share to Twitter
  const ShareToTwitter = (item) => {
    // item is an object

    const itemType = item.title ? 'Poetry' : 'Proverb'

    const textToShare = item.title || item.content

    // twitter text
    let tweetText = `Check out this Somali ${itemType}: "${textToShare}"`

    const websiteLink = 'https://http://localhost:5173/' // after app hosted replace this with the actual URL of your website
    const fullTextLink = ` - View full text: ${websiteLink}/ExpandedView/${item.id}` // path to take the twitter user to the full text of the item in our site

    const potentialTweet = tweetText + fullTextLink

    // 280 is the max length of a tweet
    let spaceForLogoUrl = 280 - potentialTweet.length - 24 // 24 chars for the URL shortening
    if (spaceForLogoUrl > 0) {
      tweetText = potentialTweet
    } else {
      tweetText = potentialTweet
    }

    // Truncate if still too long
    if (tweetText.length > 280) {
      const maxMeaningLength =
        280 - (tweetText.length - item.meaning.length) - 3 // 3 chars for the ellipsis
      const truncatedMeaning = item.meaning.slice(0, maxMeaningLength) + '...'
      tweetText = `Check out this Somali${itemType}: "${textToShare}"\nMeaning: "${truncatedMeaning}"\n`
    }

    const shareToTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText,
    )}`
    window.open(shareToTwitterUrl, '_blank')
  }

  // Show the full text of the item
  const showFullText = async (itemId) => {
    try {
      // take the user to the displayPoetry page along with the item id
      router.push({
        name: 'SubmissionDetails',
        params: {
          id: itemId,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  // take a user to a user dashboard
  const userdashboard = (email) => {
    try {
      router.push({
        name: 'UserDashboard',
        params: {
          id: email,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  // delete a submission
  const deleteSubmission = async (id, uid) => {
    const data = {
      id,
      uid,
    }
    try {
      await service.deleteSubmission(data)
      // reload the page
      location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  const updateUsername = async (username) => {
    // pass

    try {
      const updateuser = await service.usernameUpdate(username)
      if (updateuser && updateuser.message) {
        return updateuser.message
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    ShareToTwitter,
    upvote,
    downvote,
    showFullText,
    userdashboard,
    deleteSubmission,
    updateUsername,
  }
}
