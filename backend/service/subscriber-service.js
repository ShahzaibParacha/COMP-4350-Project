const Subscriber = require("../model/subscriber-model")

async function getUserAudiencePage(userId, pageNum, pageSize) {
    return await Subscriber.getAudiencePageByUserId(userId, pageNum, pageSize)
}

async function getUserFollowingPage(userId, pageNum, pageSize) {
    return await Subscriber.getCreatorPageByUserId(userId, pageNum, pageSize)
}

async function turnOnOrOffNotification(creatorId, audienceId, notificationSetting) {
    return await Subscriber.updateIsNotification(creatorId, audienceId, notificationSetting)
}

async function subscribeCreator(creatorId, audienceId) {
    return await Subscriber.subscribeUser(creatorId, audienceId)
}

async function cancelSubscription(creatorId, audienceId) {
    return await Subscriber.cancelSubscribeRelation(creatorId, audienceId)
}

async function isSubscribed(creatorId, audienceId) {
    let result = await Subscriber.getSubscription(creatorId, audienceId)
    return result !== undefined && result !== null
}

module.exports = {
    getUserAudiencePage,
    getUserFollowingPage,
    turnOnOrOffNotification,
    subscribeCreator,
    cancelSubscription,
    isSubscribed
}