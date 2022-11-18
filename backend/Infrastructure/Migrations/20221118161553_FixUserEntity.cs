using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    public partial class FixUserEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoggedIn",
                table: "Users");

            migrationBuilder.AddColumn<bool>(
                name: "IsFirstTimeLogIn",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFirstTimeLogIn",
                table: "Users");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoggedIn",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }
    }
}
