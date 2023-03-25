const Post = require('../schema/post-schema');

const getRecommendatedPosts = async (post_id) => {
	const numSimilarPosts = 5;
	Post.findById(post_id, (err, post) => {
		if (err) {
			console.error(err);
			return;
		}

		console.log("The original content: " + post.content);
		//try to find similar posts
		Post.aggregate([
			{
				"$search": {
					"index": 'searchPost',
					moreLikeThis: {
						like:{
							"content": post.content,
							}
					}
				}
			},
			{ "$limit": numSimilarPosts}
		]).exec((err, result) => {
			if (err) {
			  console.error(err);
			  return;
			}
			console.log("The similar posts are:")
			console.log( result )
			
			return result
		});
	});
};

// get all posts
const getAllPosts = async () => {
	return await Post.find({});
};

// get a page of posts
// page_size - the number of posts to send
// page_number -
// if page_number = 0, then send the ten latest posts
// if page_number = 1, then send the next ten latest posts
// ...
const getPageOfPosts = async (page_number, page_size) => {
	const query = await Post.find({}
		, null
		, { sort: { post_date: -1 }, skip: page_number * page_size, limit: page_size });

	return query;
};

// get a post by id
// returns the found document
const getPostByID = async (id) => {
	return await Post.findOne({ _id: id });
};

// get all posts of a user
// returns the documents
const getAllPostsFromUser = async (user_id) => {
	return await Post.find({ user_id });
};

// count the number of posts made by a user
const countPostsFromUser = async (user_id) => {
	return await Post.countDocuments({ user_id });
};

// create a new post
// returns the new document
const createPost = async (user_id, content, title, image) => {
	return await Post.create({ user_id, content, title, image });
};

// remove a post by id
// returns the found document
const removePostByID = async (id) => {
	return await Post.findOneAndDelete({ _id: id }, { useFindAndModify: false });
};

// remove all the posts of a user
// returns an object with property deletedCount, which is the number of documents deleted
const removeAllPostsFromUser = async (user_id) => {
	return await Post.deleteMany({ user_id });
};

// update the content of a post
// returns the object updated
const updateContent = async (id, content) => {
	return await Post.findOneAndUpdate({ _id: id }, { content }, { useFindAndModify: false });
};

module.exports = {
	getAllPosts,
	getPageOfPosts,
	getPostByID,
	getAllPostsFromUser,
	createPost,
	removePostByID,
	removeAllPostsFromUser,
	updateContent,
	countPostsFromUser,
	getRecommendatedPosts
};
