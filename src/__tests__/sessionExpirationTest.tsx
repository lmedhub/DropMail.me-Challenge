import { renderHook } from "@testing-library/react";
import useSessionExpiration from "../useSessionExpiration";

describe("useSessionExpiration", () => {
  const localStorageMock = {
    getItem: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
  });

  it("chama setSessionID se a sessão for válida", () => {
    localStorageMock.getItem.mockReturnValueOnce("validSessionID");
    localStorageMock.getItem.mockReturnValueOnce("1700000000000");

    const setSessionID = jest.fn();
    const clearSession = jest.fn();

    renderHook(() =>
      useSessionExpiration({
        setSessionID,
        clearSession,
      })
    );

    expect(setSessionID).toHaveBeenCalledWith("validSessionID");
  });

  it("chama clearSession se a sessão expirou", () => {
    localStorageMock.getItem.mockReturnValueOnce("expiredSessionID");
    localStorageMock.getItem.mockReturnValueOnce("1000000000000");

    const setSessionID = jest.fn();
    const clearSession = jest.fn();

    renderHook(() =>
      useSessionExpiration({
        setSessionID,
        clearSession,
      })
    );

    expect(clearSession).toHaveBeenCalled();
  });
});
