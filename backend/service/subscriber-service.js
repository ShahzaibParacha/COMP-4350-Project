const userService = require('../service/user-service');
const Result = require('../util/Result');
const noticer = require('../util/notification');

const Subscriber = require('../model/subscriber-model');

async function getUserAudiences (userId, pageNum, pageSize) {
	if (pageNum === undefined || pageNum === null || pageSize === undefined || pageSize === null || isNaN(pageSize) || isNaN(pageNum)) { return await Subscriber.getAllAudienceByUserId(userId); } else { return await Subscriber.getAudiencePageByUserId(userId, pageNum, pageSize); }
}

async function notifyAudiences (user_id, post_id, content) {
	const creator = await userService.getUserInfo(user_id);
	const subscribers = await getUserAudiences(user_id);

	try {
		const audience_emails = [];

		if (subscribers.length != 0) {
			const subject = 'New post from your subscribed CASTr ' + creator.username + '!';
			const content_trunc = content.substr(0, 200) + '...';

			for (const subscriber of subscribers) {
				const receive_state = subscriber.receive_notification;
				if (receive_state) {
					const audience = await userService.getUserInfo(subscriber.audience_id);
					const result = await noticer.sendEmailToSubscriber(audience.email, subject, content_trunc);
					audience_emails.push(result[0]);
				}
			}
		}
		return { notification_state: 'success', notification_accepted_by: audience_emails };
	} catch {
		/* istanbul ignore next */
		return Result.failNotify();
	}
}

async function getUserFollowingPage (userId, pageNum, pageSize) {
	return await Subscriber.getCreatorPageByUserId(userId, pageNum, pageSize);
}

async function turnOnOrOffNotification (creatorId, audienceId, notificationSetting) {
	return await Subscriber.updateIsNotification(creatorId, audienceId, notificationSetting);
}

async function subscribeCreator (creatorId, audienceId) {
	return await Subscriber.subscribeUser(creatorId, audienceId);
}

async function cancelSubscription (creatorId, audienceId) {
	return await Subscriber.cancelSubscribeRelation(creatorId, audienceId);
}

async function isSubscribed (creatorId, audienceId) {
	const result = await Subscriber.getSubscription(creatorId, audienceId);
	return result !== undefined && result !== null;
}

async function getSubscription (creatorId, audienceId) {
	return Subscriber.getSubscription(creatorId, audienceId);
}

module.exports = {
	getUserAudiences,
	notifyAudiences,
	getUserFollowingPage,
	turnOnOrOffNotification,
	subscribeCreator,
	cancelSubscription,
	isSubscribed,
	getSubscription
};
