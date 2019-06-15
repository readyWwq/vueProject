// sql语句
var sqlMap = {
  countAll: 'select count(*) from userinfo', // ?表名   计算数据库总条数
  // 用户
  user: {
    UserLogin: 'SELECT * FROM userinfo WHERE userName = ?;', //登陆语句
    UserAdd: 'insert into userinfo(userName, passWord, image,Email) values ( ?, ?,?,?);', //添加语句
    UserQuery: "select * from userinfo limit ?,?;", //查询所有用户表
    delectUser: 'DELETE FROM userinfo WHERE id in (?);', //删除用户
    searchUser: "select * from userinfo where concat(userName,passWord,id,creatTime) like ?;", //模糊查询用户
    updateUser: "UPDATE userinfo SET userName = ? ,passWord = ? ,image = ? ,Email=? WHERE id = ?", //修改用户名和密码
    updateUserType: "UPDATE userinfo SET user_type = ?  WHERE id = ?", //修改用户状态
  },
  //栏目
  column: {
    addColumn: 'insert into columnlist(columnName, belongId, sort, checkRoot, belongName,`describe`,imgUrl, userID) values ( ?, ?, ?, ?,?,?,?,?);', //增加栏目
    queryColumn: 'select * from columnlist where userID=? AND isPhoto = 0;', //查询栏目表
    queryTopColumn: 'select * from columnlist where userID=? and belongId = ?;', //查询栏目表
    queryPhoto: 'SELECT * FROM columnlist WHERE isPhoto = 1 AND userID = ?; ',
    delectColumn: 'delete from columnlist where id in (?);', //删除栏目
    searchColumn: 'select * from columnlist where userID=? and concat(columnName) like ?;', //根据名字模糊查询
    updateColumn: 'update columnlist set columnName = ? ,belongId = ? , checkRoot = ? ,belongName = ?, sort = ? , `describe` = ? ,imgUrl = ? where id = ?;', //根据ID修改
  },
  artice: {
    addArtice: 'insert into artice(userID,columnId,articeTitle,abstract,content,author,checkRoot,imgurl,columnName,setTime) values(?,?,?,?,?,?,?,?,?,?);', //添加文章
    queryArtice: 'select * from artice where recycle=1 and columnId=?', //根据栏目id查找文章
    delectArtice: 'DELETE FROM artice WHERE id in (?);', //删除文章
    updateArtice: 'update artice set columnId=?,articeTitle=?,abstract=?,content=?,author=?,checkRoot=?,imgurl=?,columnName=?,setTime=? where id = ?', //修改文章
    searchArtice: 'select * from artice where userID = ? and recycle=? and concat(articeTitle,author,abstract) like ?;', //根据名字模糊查询
    articeInfo: 'select * from artice where checkRoot=1 and id = ?', //前台查询
    articeClickNumber: 'UPDATE artice SET clickNumber = clickNumber+1 WHERE id=?', //点击率
    recommendArtice: 'update artice set recommend = ? where id = ?', //设置推荐文章
    queryRecommend: 'select * from artice where recommend = 1 and recycle = 1 and checkRoot = 1 order by setTime DESC limit 0,8', //查询前八条数据
  },
  //权限
  root:{
    queryRoot:`SELECT
                \tuserinfo.id,
                \troot_menu.menu_id,
                \troot_menu.menu_name,
                \troot_menu.rootPath,
                \troot_menu.menu_grade,
                \troot_menu.main_id 
                FROM
                \tuserinfo
                \tINNER JOIN root_center ON userinfo.id = root_center.user_id
                \tINNER JOIN root_menu ON root_center.menu_id = root_menu.menu_id WHERE id = ?;`,
    queryRootList:`select * from root_menu;`,
    removeEoot_menu:`DELETE FROM root_center WHERE user_id = ?;`,//删除权限中间表数据
    insertRootMenu:``,//添加数据
  },
}

module.exports = sqlMap;
