package mysql

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"  //这里是下载的mysql驱动
	"time"
)

func (mysql *Mysql) Connect() {
	dsn := fmt.Sprintf("%s:%s@%s(%s:%d)/%s", mysql.USERNAME, mysql.PASSWORD, mysql.NETWORK, mysql.SERVER, mysql.PORT, mysql.DATABASE)
	DB, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Printf("Open mysql failed,err:%v\n", err)
		return
	}
	DB.SetConnMaxLifetime(100 * time.Second)
	DB.SetMaxOpenConns(100)
	DB.SetMaxIdleConns(16)
	mysql.DB = DB
}

func GetMysql(USERNAME string, PASSWORD string, NETWORK string, SERVER string, PORT int, DATABASE string) *Mysql{
	var mysql Mysql
	mysql.USERNAME = USERNAME
	mysql.PASSWORD = PASSWORD
	mysql.NETWORK = NETWORK
	mysql.SERVER = SERVER
	mysql.PORT = PORT
	mysql.DATABASE = DATABASE
	mysql.Connect()
	return &mysql
}

type Mysql struct {
	USERNAME string
	PASSWORD string
	NETWORK string
	SERVER string
	PORT int
	DATABASE string
	DB *sql.DB
}
