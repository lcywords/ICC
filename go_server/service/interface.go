package service

type Mysql interface {
	Connect()
	QueryOne()
	QueryMulti()
	InsertData()
	UpdateData()
	DeleteData()
}

type Redis interface {
	InitRedis()
	ExecRedis(cmd string, key interface{}, args ...interface{}) (interface{}, error)
}
