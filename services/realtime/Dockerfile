FROM golang:1.26-alpine AS build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/realtime ./cmd/realtime \
  && mkdir -p /out/data/autocert

FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /out/realtime /realtime
COPY --from=build --chown=65532:65532 /out/data /data

ENV GOMEMLIMIT=200MiB

EXPOSE 80 443 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD ["/realtime", "healthcheck"]
ENTRYPOINT ["/realtime"]
