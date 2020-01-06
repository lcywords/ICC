package model

type Database struct {
	mysql Mysql
	redis Redis
}

type Container struct {
	DB Database
}
