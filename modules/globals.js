var GOOGLE_API_KEYS = [
    "",
    "AIzaSyCoWnRV1a-5GZAwJFRgrQlU0xmDFJRjzVQ",
    "AIzaSyBLRq6bkEP8ZiJ0BBfFQ78Bq2LzVjX3-o8",
    "AIzaSyBbAX5JrFJ8Y6YqLV84-ex52z9tBGJd92o",
    "AIzaSyAVWw8oS6JCdAIwqes8xKC5SFZ5GFzualM",
    "AIzaSyA40uFvZXdxaVkmXiK6Rldo7NBcY-lKLOk"
];

exports.getGoogleAPIKeys = function(development) {
	if (development) {
		return ["AIzaSyBbAX5JrFJ8Y6YqLV84-ex52z9tBGJd92o"];
	}
	return GOOGLE_API_KEYS;
}
