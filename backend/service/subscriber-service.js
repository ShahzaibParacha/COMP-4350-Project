const Subscriber = require("../model/subscriber-model")

async function getUserAudiences(userId, pageNum, pageSize) {
    if (pageNum === undefined || pageNum === null || pageSize === undefined || pageSize === null || isNaN(pageSize) || isNaN(pageNum))
        return await Subscriber.getAllAudienceByUserId(userId)
    else
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

async function getSubscription(creatorId, audienceId) {
    return Subscriber.getSubscription(creatorId, audienceId)
}

module.exports = {
    getUserAudiences,
    getUserFollowingPage,
    turnOnOrOffNotification,
    subscribeCreator,
    cancelSubscription,
    isSubscribed,
    getSubscription
}