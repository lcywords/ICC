package mysql

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"  //这里是下载的mysql驱动
)

//查询单行
func (sql *Mysql) QueryOne() {
	user := new(User)
	row := sql.DB.QueryRow("select * from users where id=?", 1)
	if err := row.Scan(&user.ID, &user.Name, &user.Age); err != nil {
		fmt.Printf("scan failed, err:%v", err)
		return
	}
	fmt.Println(*user)
}

//查询多行
func (sql *Mysql) QueryMulti() {
	user := new(User)
	rows, err := sql.DB.Query("select * from users where id > ?", 1)
	defer func() {
		if rows != nil {
			rows.Close()
		}
	}()
	if err != nil {
		fmt.Printf("Query failed,err:%v", err)
		return
	}
	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Name, &user.Age)
		if err != nil {
			fmt.Printf("Scan failed,err:%v", err)
			return
		}
		fmt.Print(*user)
	}

}

//插入数据
func (sql *Mysql) InsertData(){
	result,err := sql.DB.Exec("insert INTO users(name,age) values(?,?)","YDZ",23)
	if err != nil{
		fmt.Printf("Insert failed,err:%v",err)
		return
	}
	lastInsertID,err := result.LastInsertId()
	if err != nil {
		fmt.Printf("Get lastInsertID failed,err:%v",err)
		return
	}
	fmt.Println("LastInsertID:",lastInsertID)
	rowsaffected,err := result.RowsAffected()
	if err != nil {
		fmt.Printf("Get RowsAffected failed,err:%v",err)
		return
	}
	fmt.Println("RowsAffected:",rowsaffected)
}

//更新数据
func (sql *Mysql) UpdateData(){
	result,err := sql.DB.Exec("UPDATE users set age=? where id=?","30",3)
	if err != nil{
		fmt.Printf("Insert failed,err:%v",err)
		return
	}
	rowsaffected,err := result.RowsAffected()
	if err != nil {
		fmt.Printf("Get RowsAffected failed,err:%v",err)
		return
	}
	fmt.Println("RowsAffected:",rowsaffected)
}

//删除数据
func (sql *Mysql) DeleteData(){
	result,err := sql.DB.Exec("delete from users where id=?",1)
	if err != nil{
		fmt.Printf("Insert failed,err:%v",err)
		return
	}
	rowsaffected,err := result.RowsAffected()
	if err != nil {
		fmt.Printf("Get RowsAffected failed,err:%v",err)
		return
	}
	fmt.Println("RowsAffected:",rowsaffected)
}

//查询
func (sql *Mysql) TestMysql() {
	result,err := sql.DB.Exec("select * from users",1)
	if err != nil{
		fmt.Printf("Insert failed,err:%v",err)
		return
	}
	rowsaffected,err := result.RowsAffected()
	if err != nil {
		fmt.Printf("Get RowsAffected failed,err:%v",err)
		return
	}
	fmt.Println("RowsAffected:",rowsaffected)
}