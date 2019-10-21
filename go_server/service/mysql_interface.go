package service

type Mysql interface {
	Connect()
	QueryOne()
	QueryMulti()
	InsertData()
	UpdateData()
	DeleteData()
}
