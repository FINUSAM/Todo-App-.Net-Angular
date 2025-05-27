FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY . .
RUN dotnet restore
EXPOSE 5260
ENTRYPOINT ["dotnet", "run", "--urls", "http://0.0.0.0:5260"]