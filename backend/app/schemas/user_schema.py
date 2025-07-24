from marshmallow import Schema, fields, validate

class UserRegisterSchema(Schema):
    firstname = fields.String(required=True, validate=validate.Length(min=2))
    lastname = fields.String(required=True, validate=validate.Length(min=2))
    email=fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

class UserUpdateSchema(Schema):
    firstname = fields.String(validate=validate.Length(min=2))
    lastname = fields.String(validate=validate.Length(min=2))
    email=fields.Email()
    password = fields.String(validate=validate.Length(min=6))
    bio= fields.String()
    github_url = fields.String()
    website_url = fields.String()
    linkedin_url = fields.String()
    