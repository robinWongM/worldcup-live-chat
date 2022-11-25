// main.go
package main

import (
	"encoding/binary"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/netip"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/speps/go-hashids/v2"
)

func ToSingleHex(ip net.IP) string {
	i := int(ip[12]) * 16777216
	i += int(ip[13]) * 65536
	i += int(ip[14]) * 256
	i += int(ip[15])
	return fmt.Sprintf("%x", i)
}

func main() {
	app := pocketbase.New()

	hasher, _ := hashids.NewWithData(&hashids.HashIDData{
		Salt:     os.Getenv("LIVE_HASH_SALT"),
		Alphabet: hashids.DefaultAlphabet,
	})

	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == "messages" {
			ip := netip.MustParseAddr(e.HttpContext.RealIP()).AsSlice()
			hash, err := hasher.EncodeInt64([]int64{int64(binary.BigEndian.Uint32(ip))})
			if err != nil {
				return err
			}
			e.Record.Set("ipHash", hash)
		}
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/online",
			Handler: func(c echo.Context) error {
				count := len(app.SubscriptionsBroker().Clients())
				return c.JSON(http.StatusOK, count)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
			},
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
