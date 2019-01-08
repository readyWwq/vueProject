// sql语句
var sqlMap = {
  countAll:'select count(*) from ?',// ?表名   计算数据库总条数
  // 用户
  user: {
    UserLogin: 'SELECT passWord FROM userinfo WHERE userName = ?;', //登陆语句
    UserAdd: 'insert into userinfo(userName, passWord) values ( ?, ?);', //添加语句
    UserQuery: "select * from userinfo limit ?,?;", //查询所有用户表
    delectUser: 'DELETE FROM userinfo WHERE id in (?);', //删除用户
    searchUser: "select * from userinfo where concat(userName,passWord,id,creatTime) like ?;", //模糊查询用户
  }
}

module.exports = sqlMap;
