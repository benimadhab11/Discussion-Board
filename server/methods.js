Meteor.methods({
  

    createThread: function(topicId, header, content){
        check(topicId, String);
        check(header, String);
        check(content, String);
        var user = Meteor.user();
        if (!user) {
            throw new Meteor.Error("You are not logged in!");
        }
        if (!header){
            throw new Meteor.Error("Discussion Topic is required!");
        }
        if (!content){
            throw new Meteor.Error("Discussion Content is required!");
        }
        if (user.services.facebook){
          console.log(user.profile.name);
          console.log(user.services.facebook.email);
          console.log(user.services.facebook.last_name);

          var result;
          result = Meteor.http.get("https://graph.facebook.com/me", {
            params: {
              access_token: user.services.facebook.accessToken,
              fields: 'picture'
            }
          });
          if(result.error) {
            console.log(result.error);
          }
          else{

            console.log(result.data.picture.data.url);
          }
          var thread = {
              author: user.profile.name,
              authorGender : user.services.facebook.gender,
              authorfbId : user.services.facebook.id,
              authorfbUrl : user.services.facebook.link,
              authorEmail : user.services.facebook.email,
              createdAt: new Date(),
              topicId: topicId,
              header: header,
              content: content,
              picSrc : result.data.picture.data.url
          };
        }
        else{
        console.log(user);
        var thread = {
            author: user.emails[0].address,
            createdAt: new Date(),
            topicId: topicId,
            header: header,
            content: content
        };
        }
        return Threads.insert(thread);
    },

    createPost: function(threadId, content){
        check(threadId, String);
        check(content, String);
        var user = Meteor.user();
        if (!user) {
            throw new Meteor.Error("You are not logged in!");
        }
        if (!content) {
            throw new Meteor.Error("Content is required!");
        }
        if (user.services.facebook){
          console.log("Hello facebook!");
          var result;
          result = Meteor.http.get("https://graph.facebook.com/me", {
            params: {
              access_token: user.services.facebook.accessToken,
              fields: 'picture'
            }
          });
          if(result.error) {
            console.log(result.error);
          }
          else{

            console.log(result.data.picture.data.url);
          }

          var post = {
              author: user.profile.name,
              createdAt: new Date(),
              threadId: threadId,
              content: content,
              picSrc : result.data.picture.data.url
          };
        }
        else{
        console.log(user);
        var post = {
            author: user.emails[0].address,
            createdAt: new Date(),
            threadId: threadId,
            content: content
        };
        }

        return Posts.insert(post);
    }
});
