const userService = require("../service/user-service")
const Result = require("../util/Result")
const noticer = require("../util/notification")

const Subscriber = require("../model/subscriber-model")

async function getUserAudiences(userId, pageNum, pageSize) {
    if (pageNum === undefined || pageNum === null || pageSize === undefined || pageSize === null || isNaN(pageSize) || isNaN(pageNum))
        return await Subscriber.getAllAudienceByUserId(userId)
    else
        return await Subscriber.getAudiencePageByUserId(userId, pageNum, pageSize)
}

//TODO: right now the post_id is not used
async function noticefyAudiences(user_id, post_id, content){
    const creator = await userService.getUserInfo(user_id)
    const subscribers = await getUserAudiences(user_id)
    console.log("The number of audiences for the user is: " + subscribers.length)

    try{
        if(subscribers.length != 0){
            const subject = 'New post from your subscribed CASTr ' + creator['username'] + "!"
            //const url = '?'
            const content_trunc = content.substr(0, 200) + '...';

            for( let subscriber of subscribers){
                console.log(subscriber)
                const receive_state = subscriber.receive_notification
                if( receive_state ){
                    const audience = await userService.getUserInfo(subscriber.audience_id)
                    noticer.sendEmailToSubscriber( audience.email, subject, content_trunc )
                }
            }
            return {"subscription-msg": "Successfully sent the notifications to the subsribers!"}
        }else{
            return {"subscription-msg": "There is no subscribers for this user!"}
        }
    }catch{
        return {"subscription-msg": "Fail to notify the subscribers"}
    }
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
    noticefyAudiences,
    getUserFollowingPage,
    turnOnOrOffNotification,
    subscribeCreator,
    cancelSubscription,
    isSubscribed,
    getSubscription
}