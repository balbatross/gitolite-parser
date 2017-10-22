var fs = require('fs');

class GitoliteParser {
   constructor(){

   }

   parse(config, cb){
      fs.stat(config, (err, stat) => {
         if(err && !stat){
            this.parseConfig(config, cb);
         }else{
            if(stat.isFile()){
               this.parseFile(config, cb);
            }
         }
      });
   }

   parseConfig(config, cb){
      cb(null, this.splitRepos(config));  
   }

   parseFile(path, cb){
      fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
         cb(err, this.splitRepos(data));
      });
   }

   parseRepo(repo){
      var parts = repo.trim().split(' ');
      parts.splice(0, 1);
      return parts.join(' ');
   }

   splitRepos(config){
      var repos = [];
      var config_lines = config.split('\n');
      var repo;
      for(var i = 0; i  < config_lines.length; i++){
         if(config_lines[i].indexOf('repo') > -1){
            if(repo){
               repos.push(repo);
            }
            repo = {};
            
            repo['title'] = this.parseRepo(config_lines[i]);
            repo['rules'] = [];
         }else{
            if(config_lines[i].trim().length > 0){
               repo['rules'].push(this.parseRule(config_lines[i]));
            }
         }
      }
      return repos;

   }

   parseRule(rule){
      var parts = rule.split('=').map((x) => x.trim());
      var people = parts[1].split(' ');
      return { access: parts[0], keys: people };
   }

}

module.exports = new GitoliteParser();
