// Tests de controlador
import { signUpController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { AppError } from "@/common/errors";

jest.mock("@/modules/auth/auth.service");

describe("Auth Module - signUpController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("debería crear un usuario exitosamente", async () => {
    const fakeUser = { id: 1, email: "test@example.com", name: "Miguel", role: "USER", password: "hashed", createdAt: new Date(), updatedAt: new Date() };
    (AuthService.signUp as jest.Mock).mockResolvedValue(fakeUser);

    req.body = { email: "test@example.com", name: "Miguel", role: "USER", password: "Passw0rd123" };

    await signUpController(req, res);

    expect(AuthService.signUp).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: "Usuario creado exitosamente",
      data: {
        user: {
          id: 1,
          email: "test@example.com",
          name: "Miguel",
          role: "USER"
        }
      },
    }));
  });

  it("debería manejar error si el usuario ya existe", async () => {
    (AuthService.signUp as jest.Mock).mockRejectedValue(new AppError("El usuario ya existe", 409));
    req.body = { email: "test@example.com", name: "Miguel", role: "USER", password: "Passw0rd123" };

    await signUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "El usuario ya existe",
    }));
  });

  it("debería manejar error inesperado", async () => {
    (AuthService.signUp as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    req.body = { email: "test@example.com", name: "Miguel", role: "USER", password: "Passw0rd123" };

    await signUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Ha ocurrido un error inesperado",
    }));
  });
});
