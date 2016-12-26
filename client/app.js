angular.module('forum', ['angular-meteor', 'ui.router', 'accounts.ui','satellizer'])
    .config(function($urlRouterProvider, $stateProvider, $authProvider){
        // Social Sign On
        // $authProvider.facebook({
        //   clientId: 'Facebook App ID'
        // });var responseStatus;
        // FB.getLoginStatus(function(response) {
        //   console.log(response);
        //   responseStatus = response;
        // });
        // console.log('Welcome!  Fetching your information.... ');
        // FB.api('/me', function(response) {
        //   console.log('Successful login for: ' + response.name);
        //   document.getElementById('status').innerHTML =
        //     'Thanks for logging in, ' + response.name + '!';
        // });

        // Set the default route
        $urlRouterProvider
            .when('/', '/topics')
            .otherwise('/topics');
        // Add states
        $stateProvider.state('topics', {
            url: '/topics',
            templateUrl: 'views/pages/topics.html',
            controller: 'TopicsContoller',
            resolve: {
                currentUser: ["$meteor", function($meteor){
                     return $meteor.waitForUser();
                 }]
            }

        });
        $stateProvider.state('topic', {
            url: '/topic/:topicId',
            templateUrl: 'views/pages/topic.html',
            controller: 'TopicContoller'

        });
        $stateProvider.state('thread', {
            url: '/thread/:threadId',
            templateUrl: 'views/pages/thread.html',
            controller: 'ThreadContoller'
        });
    })
    .run(function($state){

        // We inject $state here to initialize ui.router
    })
    .controller('TopicsContoller', function($scope,  $auth, currentUser, $meteor){

        console.log(currentUser);

        console.log("Wndoasksdksds");
        $scope.$on('$viewContentLoaded', function(){
          console.log("Content loaded");

        });
        $scope.subscribe('topics');
        $scope.helpers({
            topics: function() {
                return Topics.find({}, {sort: {name:1}});
            }
        });
    })
    .controller('TopicContoller', function($scope, $stateParams, $meteor){
      $scope.$on('$viewContentLoaded', function(){
        console.log("List of discussions");

      });
        $scope.subscribe('topic', function(){ return [$stateParams.topicId]; });
        $scope.subscribe('threads', function(){ return [$stateParams.topicId]; });


        $scope.helpers({
            topic: function() {
                return Topics.findOne({_id: $stateParams.topicId});
            },
            threads: function() {
              return Threads.find({topicId: $stateParams.topicId});
            },
            postsnew : function(){
              var id = Threads.find({topicId: $stateParams.topicId}).fetch()[0];
              if(typeof id != 'undefined'){
              console.log(id._id);
              console.log(Posts.find({_id: "pZ9b4vT3NxvooNzCa"}));
            }
            return Posts.find({_id: "pZ9b4vT3NxvooNzCa"});
            }
        });
        $scope.createThread = function(thread){

            $meteor.call("createThread", $stateParams.topicId, thread.header, thread.content).then(function(){
                thread.header = '';
                thread.content = '';
            }).catch(function(){
                alert("An error occured while creating the thread!");
            });
        };

    })
    .controller('ThreadContoller', function($scope, $stateParams, $meteor){
        $scope.subscribe('thread', function(){ return [$stateParams.threadId]; });
        $scope.subscribe('posts', function(){ return [$stateParams.threadId]; });
        $scope.helpers({
            thread: function() {
                return Threads.findOne({_id: $stateParams.threadId});
            },
            posts: function() {
                return Posts.find({threadId: $stateParams.threadId});
            },
            postsCount : function(){
              return Posts.find({threadId: $stateParams.threadId}).count();
            }
        });
        $scope.createPost = function(post){
            $meteor.call("createPost", $stateParams.threadId, post.content).then(function(){
                post.content = '';
            }).catch(function(){
                alert("An error occured while creating the post!");
            });
        };
    });
