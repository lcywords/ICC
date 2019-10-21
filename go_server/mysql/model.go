package mysql

import "database/sql"

type User struct {
	ID   int64          `db:"id"`
	Name sql.NullString `db:"name"`
	Age  int            `db:"age"`
}
